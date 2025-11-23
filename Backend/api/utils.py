# api/utils.py
from bson import ObjectId
from bson.json_util import dumps
import json

def bson_to_jsonable(cursor_or_docs):
    """
    Use bson.json_util.dumps to produce JSON string and then load to Python object.
    Works for cursors or lists of docs.
    """
    # dumps produces a JSON string that includes extended JSON for ObjectId, dates etc.
    json_str = dumps(cursor_or_docs)
    return json.loads(json_str)
