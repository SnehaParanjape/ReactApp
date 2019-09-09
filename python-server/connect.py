from http.server import BaseHTTPRequestHandler,HTTPServer
from os import curdir, sep
import cgi

import mysql.connector
from mysql.connector import Error

PORT_NUMBER = 8080

class myHandler(BaseHTTPRequestHandler):
	"""docstring for MyHandler"""
	def do_GET(self):
		if self.path=="/":
			self.path="/index_connect.html"
		try:
			#Check the file extension required and
			#set the right mime type

				sendReply = False
				if self.path.endswith(".html"):
					mimetype='text/html'
					sendReply = True
				if self.path.endswith(".jpg"):
					mimetype='image/jpg'
					sendReply = True
				if self.path.endswith(".gif"):
					mimetype='image/gif'
					sendReply = True
				if self.path.endswith(".js"):
					mimetype='application/javascript'
					sendReply = True
				if self.path.endswith(".css"):
					mimetype='text/css'
					sendReply = True

				if sendReply == True:
					#Open the static file requested and send it
					f = open(curdir + sep + self.path) 
					self.send_response(200)
					self.send_header('Content-type',mimetype)
					self.end_headers()
					self.wfile.write(f.read().encode('utf-8'))
					f.close()
				return

		except IOError:
			self.send_error(404,'File Not Found: %s' % self.path)

	#Handler for the POST requests
	def do_POST(self):
		if self.path=="/connect":
			form = cgi.FieldStorage(
				fp=self.rfile, 
				headers=self.headers,
				environ={'REQUEST_METHOD':'POST',
		                 'CONTENT_TYPE':self.headers['Content-Type'],
			})

			print ("Server: %s" % form["server"].value)
			print ("\nPort: %s" % form["port"].value)
			print ("\nUsername: %s" % form["username"].value)
			#print ("\nPassword: %s" % form["pwd"].value)
			print ("\nDatabase Name: %s" % form["db_name"].value)
			f_server = (form["server"].value)
			#print("Server value:",f_server)
			f_port = form["port"].value
			f_username = form["username"].value
			f_password = form["pwd"].value
			f_db_name = form["db_name"].value

			def connect(c_server, c_port, c_username, c_password, c_db_name):

				try:
					print('Connecting to MySQL database')
					conn = mysql.connector.connect(host=c_server, user=c_username, database=c_db_name)

					print("Server value:",c_server)
					print("Username value:",c_username)
					print("Database name:",c_db_name)
					#mySql_query = "show create table "+c_db_name+".Company;"
					#print("Query:",mySql_query)

					show_table = "show tables in "+c_db_name+";"
					#print("Show table query:"+show_table)
					cursor = conn.cursor()
					#cursor.execute(mySql_query)
					cursor.execute(show_table)
					records=cursor.fetchall()

					output = ''
					for i in range(len(records)):
						temp_current_table = str(records[i])
						current_table = temp_current_table.replace('(','').replace(')', '').replace('\'','').replace(',','')
						query = "show create table "+c_db_name+"."+current_table+";"
						#print("Ind Table query:"+query)
						cursor2 = conn.cursor()
						cursor2.execute(query)
						result = cursor2.fetchall()
						for rows in result:
							#print("\n\n\n\n")
							#print(rows[1])
							#print("\n\n\n\n")
							output += rows[1]
							output += "\n\n"



					#print("Tables query:"+query)

					#for i in range(len(records)):
					#	query = "show create table "+c_db_name+"."
					#	print(records[i])
					#	query.join(records[i])
					#	query += ";"
					#	print("Each query:"+query)
					#	c = conn.cursor()
					#	c.execute(query)
					#	o = c.fetchall()
					#	print(o)
					#for rows in records:
					#	print(rows[1])
					#print (len(records))
					print("Query successful")
					#return records
					return output


				except mysql.connector.Error as error:
					print('Query failed'.format(error))

				finally:
					if(conn.is_connected()):
						cursor.close()
						conn.close()
						print("Connection closed")

			r = connect(f_server, f_port, f_username, f_password, f_db_name)
			self.send_response(200)
			self.end_headers()
			#self.wfile.write(("Server %s " % form["server"].value).encode('utf-8'))
			#self.wfile.write(("\n Port %s " % form["port"].value).encode('utf-8'))
			#self.wfile.write(("\n Username %s " % form["username"].value).encode('utf-8'))
			#self.wfile.write(("\n Password %s " % form["pwd"].value).encode('utf-8'))
			#self.wfile.write(("\n Database Name %s " % form["db_name"].value).encode('utf-8'))
			self.wfile.write(("\n Query Result: %s" %r).encode('utf-8'))
			return			
	

			
try:
	#Create a web server and define the handler to manage the
	#incoming request
	server = HTTPServer(('', PORT_NUMBER), myHandler)
	print ('Started httpserver on port ' , PORT_NUMBER)
	
	#Wait forever for incoming htto requests
	server.serve_forever()

except KeyboardInterrupt:
	print ('^C received, shutting down the web server')
	server.socket.close()
		