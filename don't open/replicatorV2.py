import mysql.connector
from mysql.connector import Error
from threading import Thread
from threading import Event
import time
thread_running = True
stop_event = Event()
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
        #grab last timestamp from log for reference
        #query valid command using timestamp as basis
        #try to connect to node 2/3
        #what happen if fail?
    # #cursors for each database
    while thread_running:

        try:
            conn1 = mysql.connector.connect(**node1)
            c1 = conn1.cursor(buffered = True)
        except:
            print("Failed to connect to node 1")

        try:
            conn2 = mysql.connector.connect(**node2)
            c2 = conn2.cursor(buffered = True)
        except:
            print("Failed to connect to node 2")

        try:
            conn3 = mysql.connector.connect(**node3)
            c3 = conn3.cursor(buffered = True)
        except:
            print("Failed to connect to node 3")

        if conn1.is_connected() and conn2.is_connected() and conn3.is_connected():
            try:
                grabLog = "SELECT * FROM `Logs` where `replicated?` = 'N';"

               
                c1.execute(grabLog)               
                c2.execute(grabLog)
                c3.execute(grabLog)
                
                collatedList = c1.fetchall() + c2.fetchall() + c3.fetchall()
                collatedList.sort(key= lambda result: result[7])

                c1.execute("set @notReplicator = FALSE")
                c2.execute("set @notReplicator = FALSE")
                c3.execute("set @notReplicator = FALSE")
                # print("Records to Be replicated:",len(collatedList))
                for i in collatedList:
                    #print(i)
                    if (i[2] == "update"):
                        var = (i[4],i[5],i[6],i[3])
                        query = "Update movies SET `name`=%s,`year`=%s,`rank`=%s WHERE UUID = %s;"
                                             
                    elif (i[2] == "insert"):
                        var = (i[3],i[4],i[5],i[6])
                        query = "INSERT INTO MOVIES (UUID,`name`,`year`,`rank`) values (%s,%s,%s,%s);"

                    else:
                        query = "DELETE FROM MOVIES WHERE UUID = %s;"
                        var = [i[3]]

                    if (i[1] == "1"):
                        c1.execute(query,var)
                    elif (i[1] == "2"):
                        c2.execute(query,var)
                    else:
                        c3.execute(query,var)
                    
                    query = "update logs SET `replicated?` = \"Y\" where log_id = %s;"
                    if (i[0] == 1):
                        c1.execute( query,[i[9]] )
                    elif (i[0] == 2):
                        c2.execute(query,[i[9]] )
                    else:
                        c3.execute( query,[i[9]] )
                    

                    conn1.commit()
                    conn2.commit()
                    conn3.commit()

            except Error as err:
                print("A Connection crashed; Something went wrong: {}".format(err))
        
        
        if conn1.is_connected():
            conn1.close()
            c1.close()

        if conn2.is_connected():
            conn2.close()
            c2.close()

        if conn3.is_connected():
            conn3.close()
            c3.close()
        print("Round of Replication Completed.")

        stop_event.wait(timeout = 120)
def take_input():
    user_input = input("")
    print(" ")
if __name__ == '__main__':
    t1 = Thread(target=replicator_thread)
    t2 = Thread(target = take_input)

    t1.start()
    t2.start()

    t2.join()
    stop_event.set()
    thread_running = False
    print("Program has Terminated.")

            
        # try:
        #     conn1 = mysql.connector.connect(**node1)
        #     conn2 = mysql.connector.connect(**node2)
        #     conn3 = mysql.connector.connect(**node3)
        #     if conn1.is_connected() and conn2.is_connected() and conn3.is_connected():
        #         c1 = conn1.cursor(buffered = True)
        #         c2 = conn2.cursor(buffered = True)
        #         c3 = conn3.cursor(buffered = True)
        #         tTracker = "Select * from replicator_tracker"
        #         grabLog = "SELECT * FROM Logs WHERE `timestamp` >= %s;"
        #         c1.execute(tTracker)
        #         ts = c1.fetchone()[0]                
        #         c1.execute(grabLog,[ts])

        #         c2.execute(tTracker)
        #         ts = c2.fetchone()[0]                
        #         c2.execute(grabLog,[ts])

        #         c3.execute(tTracker)
        #         ts = c3.fetchone()[0]                
        #         c3.execute(grabLog,[ts])
        #         collatedList = c1.fetchall() + c2.fetchall() + c3.fetchall()
        #         collatedList.sort(key= lambda result: result[7])
        #         print("Records to Be replicated:",len(collatedList))        

        #         for i in collatedList:
        #             # print(i[0],"|",i[1],"|",i[2],"|",i[3],"|",i[4],"|",i[5],"|",i[6],"|",i[7])
        #             try:                        
        #                 if (i[1] == "3"): #used to navigate to target node
        #                     subCur = conn3.cursor()
        #                 elif (i[1] == "2"):
        #                     subCur = conn2.cursor()
        #                 else:
        #                     subCur = conn1.cursor()
                        
        #                 if (i[0] == "3"):#used to update timestamp
        #                     subCur2 = conn3.cursor()
        #                 elif (i[0] == "2"):
        #                     subCur2 = conn2.cursor()
        #                 else:
        #                     subCur2 = conn1.cursor()


        #                 if (i[2] == "update"):
        #                     var = (i[4],i[5],i[6],i[3])
        #                     query = """START TRANSACTION;SET @isReplicator = TRUE;Update movies SET name=%s,year=%s,rank=%s WHERE UUID = %s;commit;"""
        #                     pass                                
        #                 elif (i[2] == "insert"):
        #                     var = (i[3],i[4],i[5],i[6])
        #                     query = """START TRANSACTION;SET @isReplicator = TRUE;INSERT INTO MOVIES (UUID,`name`,`year`,`rank`) values (%s,%s,%s,%s);commit;"""
        #                     pass
        #                 else:
        #                     query = """START TRANSACTION;SET @isReplicator = TRUE;DELETE FROM MOVIES WHERE UUID = %s;commit;"""
        #                     var = [i[3]]
        #                 subCur.execute(query,var)
        #                 pass
        #             except Error as err:
        #                 print("SubConn; Something went wrong: {}".format(err))
        #                 raise
        #             finally:
                        
        #                 subCur2.execute("""start transaction;UPDATE replicator_tracker SET last=%s;commit;""", [str(i[7])] )
        #                 subCur2.close()
        #                 subCur.close()
                                                     
        # except Error as err:
        #     print("Main Connection; Something went wrong: {}".format(err))
        
        # finally:
        #     if (conn1.is_connected() ):
        #         c1.close()
        #         conn1.close()
        #     if (conn2.is_connected() ):
        #         c2.close()
        #         conn2.close()
        #     if (conn3.is_connected() ):
        #         c3.close()
        #         conn3.close()   