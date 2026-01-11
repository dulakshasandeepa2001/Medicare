import sys #that is used to access command-line arguments
from pymngo import MongoClient #importing the pymongo library to interact with MongoDB
from pymongo.errors import ServerSelectionTimeoutError

def check_mongodb_connection():
    try:
        client =MongoClient("mongodb+srv://dulakshamedicare:qwe1234@cluster1.8ck7e4w.mongodb.net/?appName=Cluster1",
                             serverSelectionTimeoutMS=5000)  # 5 second timeout
        client.admin.command('ping')  # Attempt to ping the server
        return True,"Connected"
    except ServerSelectionTimeoutError:
        return False,"Timeout"
    except Exception as e:
        return False,str(e)
    
    #check connection on startup
    if 'runserver' in sys.argv:
        is_connected,message=check_mongodb_connection()
        if is_connected:
            print("MongoDB connection successful.")
        else:
            print(f"MongoDB connection failed: {message}")
            sys.exit(1)  # Exit the application if the database connection fails    



