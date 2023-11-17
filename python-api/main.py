import flask
from flask import request, jsonify
import psycopg2
import os
app = flask.Flask(__name__)

USER = os.getenv('PGUSER')
PASSWORD = os.getenv('PGPASSWORD')
DATABASE = os.getenv('PGDATABASE')
HOST = os.getenv('PGHOST')
PORT = os.getenv('PGPORT')

@app.route('/echo', methods=['GET', 'POST'])
def echo():
    if request.method == 'POST':
        return jsonify(request.json)
    elif request.method == 'GET':
        return jsonify(request.args.to_dict())
    
@app.route('/etl', methods=['GET'])
def etl():
    conn = psycopg2.connect(database=DATABASE,
                            host=HOST,
                            user=USER,
                            password=PASSWORD,
                            port=PORT)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM drivers")
    return jsonify(cursor.fetchall())

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=3006)