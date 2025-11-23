from pymongo import MongoClient

client = MongoClient("mongodb+srv://admin:Sabari2025@cluster0.zzgsxgl.mongodb.net/dashboard")
db = client["dashboard"]    
collection = db["incident"] 
