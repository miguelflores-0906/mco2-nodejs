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
        #grab last timestamp from log for reference
        #query valid command using timestamp as basis
        #try to connect to node 2/3
        #what happen if fail?
    # #cursors for each database
    while thread_running:
        #read from node 1
        
        try:
            conn1 = mysql.connector.connect(**node1)
            conn2 = mysql.connector.connect(**node2)
            conn3 = mysql.connector.connect(**node3)
            if conn1.is_connected() and conn2.is_connected() and conn3.is_connected():
                c1 = conn1.cursor()
                c2 = conn2.cursor()
                c3 = conn3.cursor()
                tTracker = "Select * from replicator_tracker"
                grabLog = "SELECT * FROM Logs WHERE `timestamp` >= %s;"
                c1.execute(tTracker)
                ts = c1.fetchone()[0]                
                c1.execute(grabLog,[ts])

                c2.execute(tTracker)
                ts = c2.fetchone()[0]                
                c2.execute(grabLog,[ts])

                c3.execute(tTracker)
                ts = c3.fetchone()[0]                
                c3.execute(grabLog,[ts])
                collatedList = c1.fetchall() + c2.fetchall() + c3.fetchall()
                collatedList.sort(key= lambda result: result[7])
                if (conn1 and conn1.is_connected() ):
                        c1.close()
                        conn1.close()
                if (conn2 and conn2.is_connected() ):
                        c2.close()
                        conn2.close()
                if (conn3 and conn3.is_connected() ):
                        c3.close()
                        conn3.close()          

                for i in collatedList:
                    # print(i[0],"|",i[1],"|",i[2],"|",i[3],"|",i[4],"|",i[5],"|",i[6],"|",i[7])
                    try:
                        conn1 = mysql.connector.connect(**node1)
                        conn2 = mysql.connector.connect(**node2)
                        conn3 = mysql.connector.connect(**node3)                        
                        if (i[1] == "3"): #used to navigate to target node
                            subCur = conn3.cursor()
                        elif (i[1] == "2"):
                            subCur = conn2.cursor()
                        else:
                            subCur = conn1.cursor()
                        
                        if (i[0] == "3"):#used to update timestamp
                            subCur2 = conn3.cursor()
                        elif (i[0] == "2"):
                            subCur2 = conn2.cursor()
                        else:
                            subCur2 = conn1.cursor()


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
                        pass
                    except Error as err:
                        print("SubConn; Something went wrong: {}".format(err))
                        raise
                    finally:
                        
                        subCur2.execute("""start transaction;UPDATE replicator_tracker SET last=%s;commit;""", [str(i[7])] )
                        subCur2.close()
                        subCur.close()
                        
                        if (conn1 and conn1.is_connected() ):
                            c1.close()
                            conn1.close()
                        if (conn2 and conn2.is_connected() ):
                            c2.close()
                            conn2.close()
                        if (conn3 and conn3.is_connected() ):
                            c3.close()
                            conn3.close()                               
                                        
        except Error as err:
            print("Main Connection; Something went wrong: {}".format(err))
                         
        print("Round of Replication Completed.")
        time.sleep(120)

def take_input():
    user_input = input("Enter to Stop:")
    print(" ")
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