import mysql.connector
from mysql.connector import Error
from threading import Thread
import time
thread_running = True
def replicator_thread():
    global thread_running
    #setup phase
    node1 = {
        "host": "mc02-node1.mysql.database.azure.com",
        "port": 3306,
        "user": "Wolf",
        "password": "HiJxx8owM9^U9hPU8K",
        "database": 'imdb_ijs',

    }
    node2 = {
        "host": "mc02-stadvdb-grp10-node2.mysql.database.azure.com",
        "port": 3306,
        "user": "gianm",
        "password": "Qwerty12345",
        "database": 'imdb_ijs',

    } #get node params for node2
    node3 = {
        "host": "mco2-stadvdb-node3.mysql.database.azure.com",
        "port": 3306,
        "user": "narwhal_",
        "password": "Qwerty12345",
        "database": 'imdb_ijs',

    } #get node params for node 3
    conn1 = None
    conn2 = None
    conn3 = None
    subConn = None
        #grab last timestamp from log for reference
        #query valid command using timestamp as basis
        #try to connect to node 2/3
        #what happen if fail?
    # connections = { 
    #     "conn1" : mysql.connector.connect(**node1),
    #     "conn2" : mysql.connector.connect(**node2),
    #     "conn3" : mysql.connector.connect(**node3) 
    #     }
    # #cursors for each database
    while thread_running:
        #read from node 1
        
        try:
        
            conn1 = mysql.connector.connect(**node1)
            if conn1.is_connected():

                c1 = conn1.cursor() #conn1 cursor
                
                # Grabs the last timestamp from tracker table
                time_tracker = "Select * from replicator_tracker"
                
                c1.execute(time_tracker)
                ts = c1.fetchone()[0]

                logs = "SELECT * FROM Logs WHERE `timestamp` >=  %s;"
                c1.execute("SELECT * FROM Logs WHERE `timestamp` >=  %s;",[ts])
                res = c1.fetchall()
                print("success")

                for i in res:
                    try:
                        if (i[3] == "3"):
                            subConn = mysql.connector.connect(**node3)
                        else:
                            subConn = mysql.connector.connect(**node2)

                        if subConn.is_connected():
                            subCur = subConn.cursor()
                            if (i[2] == "update"):
                                var = (i[5],i[6],i[7],i[4])
                                query = """START TRANSACTION;SET @isReplicator = TRUE;Update movies SET name=%s,year=%s,rank=%s WHERE UUID = %s;commit;"""
                                pass                                
                            elif (i[2] == "insert"):
                                var = (i[4],i[5],i[6],i[7])
                                query = """START TRANSACTION;SET @isReplicator = TRUE;INSERT INTO MOVIES (UUID,`name`,`year`,`rank`) values (%s,%s,%s,%s);commit;"""
                                pass
                            else:
                                query = """START TRANSACTION;SET @isReplicator = TRUE;DELETE FROM MOVIES WHERE UUID = %s;commit;"""
                                var = [i[4]]   
                            print([i[0],str(i[1]),i[4]])
                            subCur.execute(query,var)
                    except mysql.connector.Error as err:
                        print("Sub-connection-node-1; Something went wrong: {}".format(err))
                        raise
                    finally:
                        if subConn and subConn.is_connected():
                            subCur.close()
                            subConn.close()
        except Error as err:
            print("Connection 1; Something went wrong: {}".format(err))    
        finally:
            if conn1 and conn1.is_connected():
                c1.execute("""start transaction;UPDATE replicator_tracker SET last=%s;commit;""", [str(i[1])] )           
                c1.close()
                conn1.close()
            
    
        #read from node 2
        subConn = None
        subConn2 = None
        i = None
        try:
            conn2 = mysql.connector.connect(**node2)
            if conn2.is_connected():
                c2 = conn2.cursor()
                time_tracker = "Select * from replicator_tracker"

                c2.execute(time_tracker)

                ts = c2.fetchone()[0]

                logs = "SELECT * FROM Logs WHERE `timestamp` >= \"" +str(ts) +"\";"
                c2.execute(logs)
                res = c2.fetchall()

                for i in res:
                    try:    
                        #targets = 1 , 4 ,2
                        if (i[3] == "1"):
                            subConn = mysql.connector.connect(**node1)

                        elif (i[3] == "4"): #requires both connections
                            subConn2 = mysql.connector.connect(**node3)
                            subConn = mysql.connector.connect(**node1)

                        else: #only delete
                            subConn = mysql.connector.connect(**node2)


                        if subConn.is_connected():
                            subCur = subConn.cursor()
                            if (i[2] == "update"):
                                var = (i[5],i[6],i[7],i[4])
                                query = """START TRANSACTION;SET @isReplicator = TRUE;Update movies SET name=%s,year=%s,rank=%s WHERE UUID = %s;commit;"""
                                pass                                
                            elif (i[2] == "insert"):
                                var = (i[4],i[5],i[6],i[7])
                                query = """START TRANSACTION;SET @isReplicator = TRUE;INSERT INTO MOVIES (UUID,`name`,`year`,`rank`) values (%s,%s,%s,%s);commit;"""
                                pass
                            else:
                                query = """START TRANSACTION;SET @isReplicator = TRUE;DELETE FROM MOVIES WHERE UUID = %s;commit;"""
                                var = [i[4]] 
                            subCur.execute(query,var)

                        if subConn2.is_connected():
                            subCur2 = subConn2.cursor()
                            if (i[2] == "update"):
                                var = (i[5],i[6],i[7],i[4])
                                query = """START TRANSACTION;SET @isReplicator = TRUE;Update movies SET name=%s,year=%s,rank=%s WHERE UUID = %s;commit;"""
                                pass                                
                            elif (i[2] == "insert"):
                                var = (i[4],i[5],i[6],i[7])
                                query = """START TRANSACTION;SET @isReplicator = TRUE;INSERT INTO MOVIES (UUID,`name`,`year`,`rank`) values (%s,%s,%s,%s);commit;"""
                                pass
                            else:
                                query = """START TRANSACTION;SET @isReplicator = TRUE;DELETE FROM MOVIES WHERE UUID = %s;commit;"""
                                var = [i[4]] 
                            subCur2.execute(query,var)                            
                            pass
                    except mysql.connector.Error as err:
                        print("Sub-connection-node-2; Something went wrong: {}".format(err))
                        raise
                    finally:
                        if subConn and subConn.is_connected():
                            subCur.close()
                            subConn.close()
                        if subConn2 and subConn2.is_connected():
                            subCur2.close()
                            subConn2.close()                              
        except Error as err:
            print("Connection 2; Something went wrong: {}".format(err))
        finally:
            if conn2 and conn2.is_connected():
                c2.execute("""start transaction;UPDATE replicator_tracker SET last=%s;rollback;""", [str(i[1])] )              
                c2.close()
                conn2.close()



        subConn = None
        subConn2 = None
        i = None
        try:
            conn2 = mysql.connector.connect(**node2)
            if conn2.is_connected():
                c2 = conn2.cursor()
                time_tracker = "Select * from replicator_tracker"

                c2.execute(time_tracker)

                ts = c2.fetchone()[0]

                logs = "SELECT * FROM Logs WHERE `timestamp` >= \"" +str(ts) +"\";"
                c2.execute(logs)
                res = c2.fetchall()

                for i in res:
                    print(i)
                    try:    
                        #targets = 1 , 4 ,2
                        if (i[3] == "1"):
                            subConn = mysql.connector.connect(**node1)

                        elif (i[3] == "5"): #requires both connections
                            subConn2 = mysql.connector.connect(**node2)
                            subConn = mysql.connector.connect(**node1)

                        else: #only delete
                            subConn = mysql.connector.connect(**node2)


                        if subConn.is_connected():
                            subCur = subConn.cursor()
                            if (i[2] == "update"):
                                var = (i[5],i[6],i[7],i[4])
                                query = """START TRANSACTION;SET @isReplicator = TRUE;Update movies SET name=%s,year=%s,rank=%s WHERE UUID = %s;rollback;"""
                                pass                                
                            elif (i[2] == "insert"):
                                var = (i[4],i[5],i[6],i[7])
                                query = """START TRANSACTION;SET @isReplicator = TRUE;INSERT INTO MOVIES (UUID,`name`,`year`,`rank`) values (%s,%s,%s,%s);commit;"""
                                pass
                            else:
                                query = """START TRANSACTION;SET @isReplicator = TRUE;DELETE FROM MOVIES WHERE UUID = %s;commit;"""
                                var = [i[4]] 
                            subCur.execute(query,var)

                        if subConn2.is_connected():
                            subCur2 = subConn2.cursor()
                            if (i[2] == "update"):
                                var = (i[5],i[6],i[7],i[4])
                                query = """START TRANSACTION;SET @isReplicator = TRUE;Update movies SET name=%s,year=%s,rank=%s WHERE UUID = %s;rollback;"""
                                pass                                
                            elif (i[2] == "insert"):
                                var = (i[4],i[5],i[6],i[7])
                                query = """START TRANSACTION;SET @isReplicator = TRUE;INSERT INTO MOVIES (UUID,`name`,`year`,`rank`) values (%s,%s,%s,%s);commit;"""
                                pass
                            else:
                                query = """START TRANSACTION;SET @isReplicator = TRUE;DELETE FROM MOVIES WHERE UUID = %s;commit;"""
                                var = [i[4]] 
                            subCur2.execute(query,var)                            
                            pass
                    except mysql.connector.Error as err:
                        print("Sub-connection-node-3; Something went wrong: {}".format(err))
                        raise
                    finally:
                        if subConn and subConn.is_connected():
                            subCur.close()
                            subConn.close()
                        if subConn2 and subConn2.is_connected():
                            subCur2.close()
                            subConn2.close()                              
        except Error as err:
            print("Connection 2; Something went wrong: {}".format(err))
        finally:
            if conn2 and conn2.is_connected():
                c2.execute("""start transaction;UPDATE replicator_tracker SET last=%s;rollback;""", [str(i[1])] )              
                c2.close()
                conn2.close()        
        print("Round of Replication Completed.")
        time.sleep(120)

def take_input():
    user_input = input("Enter to Stop:")
if __name__ == '__main__':
    t1 = Thread(target=replicator_thread)
    t2 = Thread(target = take_input)

    t1.start()
    t2.start()

    t2.join()
    thread_running = False
    print("Program has Terminated.")


    #sample connection:
    # conn3 = mysql.connector.connect(**node3)
    # c3 = conn3.cursor()
    # query = """START TRANSACTION;SET @isReplicator = FALSE;Insert into movies( UUID, `name`,`year`,`rank`) values ( uuid(),%s,%s,%s);commit;"""
    # var = ("###YELP",2025,None)
    # c3.execute(query,var)
    # c3.close()
    # conn3.close()        