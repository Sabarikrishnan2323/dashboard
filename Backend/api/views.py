from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from .mongo import collection
from .utils import bson_to_jsonable

def build_query(params):
    q = {}
    text_fields = ["country", "city", "region", "sector",
                   "source", "swot", "pestle", "topic", "end_year"]

 
    for f in text_fields:
        value = params.get(f)
        if value:
            parts = [x.strip() for x in value.split(",") if x.strip()]
            q[f] = {"$in": parts} if len(parts) > 1 else parts[0]

    def add_range(field):
        min_v = params.get(f"{field}_min")
        max_v = params.get(f"{field}_max")
        if min_v or max_v:
            q[field] = {}
            if min_v:
                try:
                    q[field]["$gte"] = float(min_v)
                except:
                    pass
            if max_v:
                try:
                    q[field]["$lte"] = float(max_v)
                except:
                    pass
            if not q[field]:
                q.pop(field)

    for f in ["intensity", "likelihood", "relevance"]:
        add_range(f)

   
    year_min = params.get("year_min")
    year_max = params.get("year_max")
    if year_min or year_max:
        q["year"] = {}
        if year_min:
            try:
                q["year"]["$gte"] = int(year_min)
            except:
                pass
        if year_max:
            try:
                q["year"]["$lte"] = int(year_max)
            except:
                pass
        if not q["year"]:
            q.pop("year", None)

    return q


@require_http_methods(["GET"])
def get_data(request):
    params = request.GET
    query = build_query(params)

    try:
        limit = min(int(params.get("limit", 100)), 2000)
    except:
        limit = 100

    try:
        skip = int(params.get("skip", 0))
    except:
        skip = 0

    cursor = collection.find(query, {"_id": 0}).skip(skip).limit(limit)
    docs = bson_to_jsonable(list(cursor))
    return JsonResponse(docs, safe=False)


@require_http_methods(["GET"])
def get_unique_filters(request):
    fields = ["year", "end_year", "topics", "topic", "sector",
              "region", "city", "country", "pestle", "source", "swot"]

    out = {}
    for f in fields:
        try:
            vals = collection.distinct(f)
            vals = [v for v in vals if v not in (None, "", [], {})]

            cleaned = []
            for v in vals:
                if isinstance(v, list):
                    cleaned.extend([x for x in v if x])
                else:
                    cleaned.append(v)

            out[f] = sorted(list({str(x) for x in cleaned}))
        except:
            out[f] = []

    return JsonResponse(out)



@require_http_methods(["GET"])
def get_stats(request):
    params = request.GET
    match = build_query(params)
    coll = collection
    pipeline_year = []

    if match:
        pipeline_year.append({"$match": match})

    pipeline_year.extend([
       
        {
            "$addFields": {
                "year_value": {
                    "$cond": {
                        "if": {"$and": ["$year", {"$ne": ["$year", ""]}]},
                        "then": "$year",
                        "else": {
                            "$cond": {
                                "if": {"$and": ["$end_year", {"$ne": ["$end_year", ""]}]},
                                "then": "$end_year",
                                "else": {
                                    "$cond": {
                                        "if": {"$and": ["$published", {"$ne": ["$published", ""]}]},
                                        "then": {
                                            "$substr": [
                                                "$published",
                                                0,
                                                4
                                            ]
                                        },
                                        "else": None
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        
        {
            "$addFields": {
                "year_value": {
                    "$convert": {
                        "input": "$year_value",
                        "to": "int",
                        "onError": None,
                        "onNull": None
                    }
                }
            }
        },
        {"$match": {"year_value": {"$ne": None, "$gte": 1900, "$lte": 2100}}},
        {
            "$group": {
                "_id": {"year": "$year_value"},
                "count": {"$sum": 1},
                "avgIntensity": {"$avg": "$intensity"},
                "avgLikelihood": {"$avg": "$likelihood"},
                "avgRelevance": {"$avg": "$relevance"}
            }
        },
        {"$sort": {"_id.year": 1}}
    ])

    year_stats = list(coll.aggregate(pipeline_year))


    pipeline_country = []
    if match:
        pipeline_country.append({"$match": match})

    pipeline_country.extend([
        {"$match": {"country": {"$ne": None, "$ne": ""}}},
        {
            "$group": {
                "_id": "$country",
                "count": {"$sum": 1},
                "avgIntensity": {"$avg": "$intensity"}
            }
        },
        {"$sort": {"count": -1}},
        {"$limit": 20}
    ])

    country_stats = list(coll.aggregate(pipeline_country))

  
    pipeline_topics = []
    if match:
        pipeline_topics.append({"$match": match})

    pipeline_topics.extend([
        {"$project": {"topics": 1, "topic": 1}},
        {
            "$project": {
                "topics": {
                    "$cond": [
                        {"$isArray": "$topics"}, "$topics",
                        {"$cond": [{"$gt": ["$topic", None]}, ["$topic"], []]}
                    ]
                }
            }
        },
        {"$unwind": "$topics"},
        {"$match": {"topics": {"$ne": None, "$ne": ""}}},
        {"$group": {"_id": "$topics", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 50}
    ])

    topics_stats = list(coll.aggregate(pipeline_topics))

   
    pipeline_region = []
    if match:
        pipeline_region.append({"$match": match})

    pipeline_region.extend([
        {"$match": {"region": {"$ne": None, "$ne": ""}}},
        {"$group": {"_id": "$region", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ])

    region_stats = list(coll.aggregate(pipeline_region))

      
    pipeline_city = []
    if match:
      pipeline_city.append({"$match": match})

    pipeline_city.extend([
    {"$match": {"city": {"$exists": True, "$nin": [None, "", [], {}]}}},
    {
        "$group": {
            "_id": "$city",
            "avgIntensity": {"$avg": "$intensity"},
            "avgLikelihood": {"$avg": "$likelihood"},
            "avgRelevance": {"$avg": "$relevance"},
            "count": {"$sum": 1}
        }
    },
    {"$sort": {"avgIntensity": -1}},
    {"$limit": 30}
])

    city_stats = list(coll.aggregate(pipeline_city))

    scatter = list(
        coll.find(
            match if match else {},
            {"_id": 0, "intensity": 1, "likelihood": 1,
             "relevance": 1, "year": 1, "country": 1,"city":1,}
        ).limit(5000)
    )
   
    pipeline_heatmap = []
    if match:
      pipeline_heatmap.append({"$match": match})

    pipeline_heatmap.extend([
    {"$match": {"topic": {"$exists": True, "$nin": [None, "", []]}}},
    {"$match": {"region": {"$exists": True, "$nin": [None, "", []]}}},
    {
        "$group": {
            "_id": {"topic": "$topic", "region": "$region"},
            "count": {"$sum": 1}
        }
    },
    {
        "$project": {
            "_id": 0,
            "topic": "$_id.topic",
            "region": "$_id.region",
            "count": 1
        }
    },
    {"$sort": {"count": -1}}
])

    heatmap_stats = list(coll.aggregate(pipeline_heatmap))



    return JsonResponse({
        "year_stats": bson_to_jsonable(year_stats),
        "country_stats": bson_to_jsonable(country_stats),
        "topics_stats": bson_to_jsonable(topics_stats),
        "region_stats": bson_to_jsonable(region_stats),
        "city_stats": bson_to_jsonable(city_stats),
        "scatter": bson_to_jsonable(scatter),
        "heatmap_stats": heatmap_stats, 
    }, safe=False)