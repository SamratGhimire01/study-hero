import {mn,actors,S,flow,W,T,A,writer} from '../../../tools/author.mjs';
const card=writer('advanced-java');
const DB='Shop';
// t01 Design of JDBC
card({topic:'u2.t01',slug:'jdbc-design',title:'The Design of JDBC (Architecture)',marks:'[5]',
 link:'Unit 1 made the screen. Now we store data in a database.',nextWhy:'The Driver is the key part, and there are 4 types.',
 ...flow([
  ['☕','Java App','Your Java program','Wants to save or read data.','pop'],
  ['📜','JDBC API','JDBC API (java.sql)','Same classes for every database: Connection, Statement, ResultSet.','tick'],
  ['🧑‍💼','DriverManager','DriverManager','Picks the right driver for the database URL.','click'],
  ['🔌','Driver','JDBC Driver','Translates Java calls into the database’s own language.','whoosh'],
  ['🗄️','Database','Database (MySQL, Oracle…)','Runs the SQL and sends results back.','ding','rows!']],
  ['Two-tier vs Three-tier','2-tier: App ↔ Driver ↔ DB. 3-tier: Client ↔ App/Web server (+JDBC) ↔ DB.']),
 mn:[mn('Topic trick (parts)','All Drivers Drive Daily','JDBC API · DriverManager · Driver · Database'),mn('Program steps (every JDBC program)','Little Cats Create Extra Chaos','Load driver · Connect · Create statement · Execute · Close'),mn('Tiers','Two Talks Direct, Three Takes a Middleman','')],
 code:T('Program: connect to the database',`
import java.sql.*;
public class ConnectDemo {
    public static void main(String[] args) throws Exception {
        Class.forName("com.mysql.cj.jdbc.Driver");
        Connection con = DriverManager.getConnection(
            "jdbc:mysql://localhost:3306/${DB}", "root", "");
        System.out.println("Connected!");
        con.close();
    }
}`,[
  ['main(','Program starts.','tick',{mem:[]}],
  ['Class.forName','L = Load the MySQL driver class (optional since JDBC 4, but write it in exams).','pop',{mem:['driver = MySQL loaded']}],
  ['DriverManager.getConnection','C = Connect: DriverManager finds the driver for this URL and opens a connection.','whoosh',{mem:['driver loaded','con = Connection to Shop']}],
  ['println','Connected! (Next topics: Create statement, Execute.)','ding',{con:'Connected!'}],
  ['con.close','C = Close: always free the connection.','tick',{mem:['con = closed']}]],'(complete program; needs MySQL driver JAR)'),
 ans:A({d:'<b>JDBC (Java Database Connectivity)</b> is a Java API used to connect Java programs to relational databases and run SQL queries.',
  fig:'Two-Tier:\n[Java App] <---> [JDBC Driver] <---> [Database]\n\nThree-Tier:\n[Client App] <---> [Web / App Server + JDBC] <---> [Database]',figT:'JDBC Architecture Diagram',
  pt:'Main parts',p:['<b>JDBC API (java.sql)</b>: interfaces/classes like DriverManager, Connection, Statement, PreparedStatement, ResultSet.','<b>DriverManager</b>: picks and loads the right driver for the database URL.','<b>JDBC Drivers</b>: translate Java database calls into database-specific commands.','<b>Database</b>: stores the tables and runs SQL queries.'],
  x:[['Steps in a JDBC program','<ol><li>Load driver</li><li>Connect</li><li>Create statement</li><li>Execute query</li><li>Close</li></ol>']]}),
 q:['Which class picks the right driver for a URL?',['ResultSet','DriverManager','Statement'],1,'All Drivers Drive Daily.']});

// t02 Driver types
card({topic:'u2.t02',slug:'jdbc-driver-types',title:'JDBC Driver Types and Typical Uses',marks:'[5]',
 link:'The driver connects Java to the database. There are 4 kinds.',nextWhy:'Drivers carry SQL. Now SQL itself.',
 ...flow([
  ['🌉','Type 1','Type 1: JDBC-ODBC Bridge','Java → ODBC → DB. Old, slow, removed in Java 8.','err'],
  ['🧩','Type 2','Type 2: Native-API','Uses the DB’s native (C) library. Partly Java. Needs install on client.','tick'],
  ['🌐','Type 3','Type 3: Network Protocol','Pure Java to a middleware server, which talks to the DB.','whoosh'],
  ['⚡','Type 4','Type 4: Thin driver','Pure Java, talks the DB protocol directly. Fastest. Most used (MySQL Connector/J).','ding','Best!']]),
 mn:[mn('Topic trick (4 types in order)','Old Nanny Needs Tea','ODBC bridge · Native-API · Network protocol · Thin'),mn('Points trick (why Type 4)','Pure Fast Free','Pure Java · Fastest · No extra install')],
 ans:A({d:'A <b>JDBC driver</b> is software that lets a Java program talk to a specific database. There are <b>4 types</b>.',
  tbl:{h:['Type','Name','How it works','Pros / Cons'],r:[['1','JDBC-ODBC Bridge','Java → ODBC → DB','Easy; slow, needs ODBC, removed in Java 8'],['2','Native-API (partly Java)','Uses DB client library (C/C++)','Faster than 1; needs native install'],['3','Network Protocol (pure Java)','Java → middleware server → DB','Flexible; needs middle server'],['4','Thin driver (pure Java)','Java → DB protocol directly','Fastest, portable, most used']]},
  x:[['Typical uses of JDBC','<ul><li><b>Two-tier</b>: desktop app talks to DB directly.</li><li><b>Three-tier</b>: web app (servlet/JSP) uses JDBC on the server.</li><li>Reports, banking, shop billing, student records.</li></ul>']]}),
 q:['Which driver type is pure Java and talks directly to the database?',['Type 1','Type 3','Type 4'],2,'Old Nanny Needs Tea: Thin = Type 4.']});

// t03 SQL
card({topic:'u2.t03',slug:'sql',title:'The Structured Query Language',marks:'[2.5]',
 link:'The driver carries SQL to the database.',nextWhy:'Now we set up JDBC to send that SQL.',
 ...flow([
  ['🏗️','DDL','DDL: build tables','CREATE, ALTER, DROP.','pop'],
  ['✏️','DML','DML: change rows','INSERT, UPDATE, DELETE.','tick'],
  ['🔎','DQL','DQL: ask','SELECT … FROM … WHERE.','whoosh'],
  ['🔑','DCL','DCL: permissions','GRANT, REVOKE.','tick'],
  ['💾','TCL','TCL: save/undo','COMMIT, ROLLBACK.','ding']]),
 mn:[mn('Topic trick (5 groups)','Dogs Make Quiet Cats Talk','DDL · DML · DQL · DCL · TCL'),mn('DML trick','I Use Detergent','INSERT · UPDATE · DELETE')],
 ans:A({d:'<b>SQL (Structured Query Language)</b> is the standard language to create, read, update and delete data in a relational database. JDBC sends SQL strings to the database.',
  tbl:{h:['Group','Commands','Use'],r:[['DDL','CREATE, ALTER, DROP','Define tables'],['DML','INSERT, UPDATE, DELETE','Change data'],['DQL','SELECT','Read data'],['DCL','GRANT, REVOKE','Permissions'],['TCL','COMMIT, ROLLBACK','Transactions']]},
  code:'CREATE TABLE Item (ItemID INT PRIMARY KEY, Name VARCHAR(50),\n  UnitPrice DOUBLE, Units INT, ExpiryDate DATE);\nINSERT INTO Item VALUES (1, \'Pen\', 15.0, 50, \'2027-06-15\');\nSELECT Name, UnitPrice FROM Item WHERE Units > 10;\nUPDATE Item SET UnitPrice = 20 WHERE ItemID = 1;\nDELETE FROM Item WHERE ItemID = 3;'}),
 q:['SELECT belongs to which group?',['DDL','DQL','TCL'],1,'Q = Query.']});

// t04 JDBC configuration
card({topic:'u2.t04',slug:'jdbc-configuration',title:'JDBC Configuration',marks:'[2.5]',
 link:'We know SQL. Now set up JDBC so Java can send it.',nextWhy:'Connected! Now we send SQL with statements.',
 ...flow([
  ['🗄️','Database','Have a database','Install MySQL, create database Shop.','pop'],
  ['📦','JAR','Add driver JAR','Put mysql-connector-j.jar on the classpath.','tick'],
  ['🔗','URL','Write the URL','jdbc:mysql://localhost:3306/Shop  (jdbc:subprotocol://host:port/db)','tick'],
  ['🚚','forName','Load driver','Class.forName("com.mysql.cj.jdbc.Driver")  (auto in JDBC 4+)','click'],
  ['🤝','Connect','getConnection(url, user, pass)','Returns a Connection object.','ding']]),
 mn:[mn('Topic trick (steps)','Jolly Uncles Catch Grapes','JAR on classpath · URL · Class.forName · getConnection'),mn('URL trick','Java My Local Shop','jdbc : mysql : //localhost:3306 / Shop')],
 code:T('Program: connection with try-with-resources',`
String url = "jdbc:mysql://localhost:3306/Shop";
try (Connection con = DriverManager.getConnection(url, "root", "")) {
    System.out.println("Connected to " + con.getCatalog());
}`,[
  ['String url','URL format: jdbc:<db type>://<host>:<port>/<database>.','tick',{mem:['url = jdbc:mysql://localhost:3306/Shop']}],
  ['getConnection','Open the connection with user and password.','whoosh',{mem:['url','con = Connection']}],
  ['println','Print the database name.','ding',{con:'Connected to Shop'}],
  ['}','try-with-resources closes the connection automatically.','tick',{mem:['con = closed']}]],'(inside main throws Exception)'),
 ans:A({d:'<b>JDBC configuration</b> means setting up everything a Java program needs to connect to a database.',
  pt:'Steps',p:['Install the database and create the database/table.','Add the <b>driver JAR</b> (e.g. mysql-connector-j.jar) to the classpath.','Write the <b>database URL</b>: <code>jdbc:mysql://localhost:3306/Shop</code>.','Load the driver: <code>Class.forName("com.mysql.cj.jdbc.Driver")</code> (automatic since JDBC 4).','Connect: <code>DriverManager.getConnection(url, user, password)</code>.'],
  tbl:{h:['Database','Driver class','URL'],r:[['MySQL','com.mysql.cj.jdbc.Driver','jdbc:mysql://host:3306/db'],['Oracle','oracle.jdbc.OracleDriver','jdbc:oracle:thin:@host:1521:xe'],['PostgreSQL','org.postgresql.Driver','jdbc:postgresql://host:5432/db']]}}),
 q:['Which part of the URL is the database name in jdbc:mysql://localhost:3306/Shop?',['mysql','3306','Shop'],2,'Java My Local Shop.']});

// t05 Statements (insert program)
card({topic:'u2.t05',slug:'jdbc-statements',title:'Working with JDBC Statements',marks:'[5 / Group C program]',
 link:'We are connected. Now we send SQL using a Statement.',nextWhy:'Next: run a SELECT and read the results.',
 ...flow([
  ['📝','Statement','Statement','Fixed SQL. stmt.executeUpdate("INSERT …").','pop'],
  ['📋','PreparedStatement','PreparedStatement','SQL with ? holes. Precompiled, faster, safe from SQL injection.','ding','Use me!'],
  ['📞','CallableStatement','CallableStatement','Calls stored procedures: {call proc(?)}.','tick'],
  ['🔎','executeQuery','executeQuery()','For SELECT → returns ResultSet.','whoosh'],
  ['✏️','executeUpdate','executeUpdate()','For INSERT/UPDATE/DELETE → returns number of rows.','click']]),
 mn:[mn('Topic trick (3 statements)','Simple People Call','Statement · PreparedStatement · CallableStatement'),mn('Points trick (3 methods)','Queries Update Everything','executeQuery (SELECT) · executeUpdate (INSERT/UPDATE/DELETE) · execute (any)'),mn('Program steps','Little Cats Create Extra Chaos','Load · Connect · Create statement · Execute · Close')],
 code:T('Program: insert three records into Item (Group C)',`
import java.sql.*;
public class InsertThreeItems {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/Shop";
        String sql = "INSERT INTO Item (ItemID, Name, UnitPrice, Units, ExpiryDate) VALUES (?, ?, ?, ?, ?)";
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection con = DriverManager.getConnection(url, "root", "");
            PreparedStatement ps = con.prepareStatement(sql);

            ps.setInt(1, 1); ps.setString(2, "Pen"); ps.setDouble(3, 15.0);
            ps.setInt(4, 50); ps.setDate(5, Date.valueOf("2027-06-15"));
            ps.executeUpdate();

            ps.setInt(1, 2); ps.setString(2, "Notebook"); ps.setDouble(3, 80.0);
            ps.setInt(4, 20); ps.setDate(5, Date.valueOf("2027-12-01"));
            ps.executeUpdate();

            ps.setInt(1, 3); ps.setString(2, "Eraser"); ps.setDouble(3, 10.0);
            ps.setInt(4, 100); ps.setDate(5, Date.valueOf("2028-01-10"));
            ps.executeUpdate();

            System.out.println("Three records inserted successfully!");
            con.close();
        } catch (Exception e) {
            System.out.println(e);
        }
    }
}`,[
  ['String sql','The SQL has 5 ? marks: holes we fill later.','tick',{mem:['sql = INSERT … (?, ?, ?, ?, ?)']}],
  ['Class.forName','L = Load driver.','pop',{mem:['driver loaded']}],
  ['getConnection','C = Connect to database Shop.','whoosh',{mem:['con = Connection (Shop)']}],
  ['prepareStatement','C = Create a PreparedStatement from the SQL.','pop',{mem:['con','ps = PreparedStatement']}],
  ['ps.setString(2, "Pen")','Fill holes 1, 2, 3: ItemID=1, Name=Pen, UnitPrice=15.0.','tick',{mem:['? = 1, Pen, 15.0, _, _']}],
  ['ps.setDate(5, Date.valueOf("2027-06-15"))','Fill holes 4 and 5: Units=50, Expiry=2027-06-15.','tick',{mem:['? = 1, Pen, 15.0, 50, 2027-06-15']}],
  ['ps.executeUpdate','E = Execute: row 1 saved in the table.','ding',{occ:0,con:'Item: 1 row'}],
  ['"Notebook"','Same statement, new values: row 2.','ding',{con:'Item: 2 rows'}],
  ['"Eraser"','Row 3.','ding',{con:'Item: 3 rows'}],
  ['println("Three','Message printed.','ding',{con:'Three records inserted successfully!'}],
  ['con.close','C = Close.','tick',{mem:['con closed']}]],'(complete program)'),
 ans:A({d:'A <b>Statement</b> object is used to send SQL commands to the database through a Connection.',
  tbl:{h:['Type','Use','Created by'],r:[['Statement','Fixed SQL, no parameters','con.createStatement()'],['PreparedStatement','SQL with ? parameters, precompiled, prevents SQL injection','con.prepareStatement(sql)'],['CallableStatement','Call stored procedures','con.prepareCall("{call p(?)}")']]},
  pt:'Execute methods',p:['<b>executeQuery(sql)</b>: SELECT → returns ResultSet.','<b>executeUpdate(sql)</b>: INSERT/UPDATE/DELETE/DDL → returns int (rows affected).','<b>execute(sql)</b>: any SQL → returns boolean.']}),
 q:['Which statement uses ? placeholders and prevents SQL injection?',['Statement','PreparedStatement','ResultSet'],1,'Simple People Call: P = Prepared.']});

// t06 Query execution
card({topic:'u2.t06',slug:'query-execution',title:'Query Execution',marks:'[5]',
 link:'We can insert. Now we read data back with SELECT.',nextWhy:'ResultSet can also scroll and update.',
 actors:actors(`
app|☕|Java|10|55
db|🗄️|Database|88|55
rs|📑|ResultSet|50|55|h
cur|👉|cursor|50|30|h`),
 scenes:[S('Ask: executeQuery("SELECT …")','Java sends a SELECT to the database.','app db','whoosh','app',{app:'SELECT * FROM Item'}),
  S('Answer: a ResultSet 📑','The rows come back as a ResultSet, like a small table.','app db rs','pop','rs'),
  S('Cursor starts BEFORE row 1','Think of a finger 👉 above the first row.','app db rs cur','tick','cur'),
  S('rs.next() moves down','Returns true if there is a row, false at the end.','app db rs cur','click','cur',{cur:'row 1'},{cur:[50,45]}),
  S('rs.getString("Name")','Read columns by name or number (1-based).','app db rs cur','ding','rs',{rs:'Pen, 15.0'}),
  S('Loop: while (rs.next())','Repeat for every row, then close.','app db rs','ding','rs')],
 mn:[mn('Topic trick (3 steps)','All Lions Growl','executeQuery · Loop with rs.next() · getXxx("column")'),mn('Points trick','Before First, Next is True','Cursor starts before first row; next() returns true while rows remain')],
 code:T('Program: read all items',`
Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/Shop", "root", "");
Statement st = con.createStatement();
ResultSet rs = st.executeQuery("SELECT ItemID, Name, UnitPrice FROM Item");
while (rs.next()) {
    int id = rs.getInt("ItemID");
    String name = rs.getString("Name");
    double price = rs.getDouble(3);
    System.out.println(id + " " + name + " " + price);
}
con.close();`,[
  ['getConnection','Connect.','whoosh',{mem:['con']}],
  ['createStatement','Create a Statement.','pop',{mem:['con','st']}],
  ['executeQuery','Run SELECT → get ResultSet. Cursor is before row 1.','whoosh',{mem:['rs = 3 rows','cursor: before row 1']}],
  ['while (rs.next())','next() → row 1 exists → true.','click',{mem:['rs = 3 rows','cursor: row 1']}],
  ['rs.getInt||rs.getString||rs.getDouble','Read the 3 columns (by name or index 3).','tick',{mem:['cursor: row 1','id=1, name=Pen, price=15.0']}],
  ['println','Print row 1.','ding',{con:'1 Pen 15.0'}],
  ['while (rs.next())','Loop again for row 2, 3… then next() gives false and the loop stops.','click',{con:'1 Pen 15.0 | 2 Notebook 80.0 | 3 Eraser 10.0',mem:['cursor: after last']}],
  ['con.close','Close.','tick']],'(inside main throws Exception)'),
 ans:A({d:'<b>Query execution</b> means sending a SELECT statement with <b>executeQuery()</b> and reading the returned <b>ResultSet</b> row by row.',
  p:['<code>ResultSet rs = st.executeQuery(sql);</code>','The cursor starts <b>before the first row</b>.','<code>rs.next()</code> moves to the next row; returns false at the end.','Read values with <code>getInt()</code>, <code>getString()</code>, <code>getDouble()</code>, <code>getDate()</code> by column name or number (starts at 1).','Close ResultSet, Statement and Connection after use.'],
  fig:'executeQuery() → ResultSet → while(rs.next()) → rs.getXxx("col") → print'}),
 q:['Where is the ResultSet cursor at the start?',['On the first row','Before the first row','On the last row'],1,'Before First, Next is True.']});

// t07 Scrollable & updatable
card({topic:'u2.t07',slug:'scrollable-updatable-resultset',title:'Scrollable and Updatable Result Sets',marks:'[5]',
 link:'Normal ResultSet only moves forward and is read-only.',nextWhy:'RowSet: a ResultSet that is easier and can work offline.',
 ...flow([
  ['➡️','FORWARD_ONLY','Default: forward only','Can only call next(). Read-only.','tick'],
  ['🔃','SCROLL','TYPE_SCROLL_INSENSITIVE / SENSITIVE','Move anywhere. Sensitive also sees others’ changes.','whoosh'],
  ['🧭','Move','Move anywhere','previous(), first(), last(), absolute(3), relative(-1).','click'],
  ['✏️','UPDATABLE','CONCUR_UPDATABLE','Change rows from Java.','pop'],
  ['💾','updateRow','rs.updateDouble(…) then rs.updateRow()','Change value in memory, then save to DB.','ding']]),
 mn:[mn('Topic trick (types)','Fish In Sea','FORWARD_ONLY · SCROLL_INSENSITIVE · SCROLL_SENSITIVE'),mn('Points trick (move methods)','Nice People Find Lost Animals Rarely','next · previous · first · last · absolute · relative'),mn('Update trick','Change Then Save','updateXxx() then updateRow() (insertRow / deleteRow too)')],
 code:T('Program: scroll and update',`
Statement st = con.createStatement(
    ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_UPDATABLE);
ResultSet rs = st.executeQuery("SELECT ItemID, Name, UnitPrice FROM Item");
rs.last();
System.out.println("Last item: " + rs.getString("Name"));
rs.absolute(1);
rs.updateDouble("UnitPrice", 20.0);
rs.updateRow();`,[
  ['createStatement','Ask for a SCROLLABLE and UPDATABLE ResultSet.','pop',{mem:['type = SCROLL_INSENSITIVE','concurrency = UPDATABLE']}],
  ['executeQuery','Run the SELECT.','whoosh',{mem:['rs = 3 rows','cursor: before 1']}],
  ['rs.last()','Jump straight to the last row (not possible with forward-only).','click',{mem:['cursor: row 3']}],
  ['println','Print it.','ding',{con:'Last item: Eraser'}],
  ['rs.absolute(1)','Jump to row 1.','click',{mem:['cursor: row 1 (Pen, 15.0)']}],
  ['updateDouble','Change price in the ResultSet (memory only).','tick',{mem:['cursor: row 1 (Pen, 20.0*)']}],
  ['rs.updateRow()','Save the change to the database.','ding',{con:'DB: Pen price = 20.0'}]],'(con already connected)'),
 ans:A({d:'A <b>scrollable ResultSet</b> lets the cursor move forward, backward or jump to any row. An <b>updatable ResultSet</b> lets us change database rows through the ResultSet.',
  pt:'ResultSet types',p:['<b>TYPE_FORWARD_ONLY</b> (default): only next().','<b>TYPE_SCROLL_INSENSITIVE</b>: scroll; does not see changes by others.','<b>TYPE_SCROLL_SENSITIVE</b>: scroll; sees changes by others.'],
  tbl:{h:['Concurrency','Meaning'],r:[['CONCUR_READ_ONLY','Cannot change (default)'],['CONCUR_UPDATABLE','Can update, insert, delete rows']]},
  x:[['Methods','<ul><li>Move: next(), previous(), first(), last(), absolute(n), relative(n), beforeFirst(), afterLast()</li><li>Update: updateXxx(col, value) → updateRow(); moveToInsertRow() → insertRow(); deleteRow()</li></ul>'],['Create','<pre>Statement st = con.createStatement(\n  ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_UPDATABLE);</pre>']]}),
 q:['Which method saves an updated row to the database?',['updateDouble()','updateRow()','absolute()'],1,'Change Then Save.']});

// t08 RowSet
card({topic:'u2.t08',slug:'rowsets',title:'Row Sets',marks:'[2+3]',
 link:'ResultSet needs an open connection and is not a JavaBean.',nextWhy:'Unit 3: JavaBeans (RowSet is a bean!).',
 actors:actors(`
db|🗄️|Database|12|55
j|🔌|JdbcRowSet (connected)|45|30
c|🎒|CachedRowSet (disconnected)|45|75
off|✈️|Offline|85|75|h
sync|🔄|acceptChanges()|20|80|h`),
 scenes:[S('RowSet = ResultSet + JavaBean','javax.sql.RowSet extends ResultSet. Easier, and sends events.','db j c','pop'),
  S('Connected: JdbcRowSet 🔌','Keeps the connection open all the time. Changes go to DB right away.','db j','tick','j',{j:'always online'}),
  S('Disconnected: CachedRowSet 🎒','Fetches rows, CLOSES the connection, keeps rows in memory.','db c','whoosh','c'),
  S('Works offline ✈️','Read and edit rows with no connection. It is Serializable: can be sent over a network.','db c off','pop','c',null,{c:[75,60]}),
  S('Reconnect and save 🔄','acceptChanges() writes the edits back to the database.','db c sync','ding','sync',{sync:'saved!'},{c:[30,60]}),
  S('Other disconnected types','WebRowSet (XML), FilteredRowSet (filter), JoinRowSet (join).','db j c','tick')],
 mn:[mn('Topic trick (types)','Just Cats Will Find Joy','JdbcRowSet · CachedRowSet · WebRowSet · FilteredRowSet · JoinRowSet'),mn('Points trick (difference)','Connected = Constantly online, Disconnected = Does work offline',''),mn('Use trick (2 uses)','Simple Signals','Simpler than ResultSet · Sends events (it is a JavaBean)')],
 code:T('Program: CachedRowSet (disconnected)',`
CachedRowSet crs = RowSetProvider.newFactory().createCachedRowSet();
crs.setUrl("jdbc:mysql://localhost:3306/Shop");
crs.setUsername("root");
crs.setPassword("");
crs.setCommand("SELECT * FROM Item");
crs.execute();
while (crs.next()) {
    System.out.println(crs.getString("Name"));
}`,[
  ['RowSetProvider','Make a CachedRowSet using the factory.','pop',{mem:['crs = CachedRowSet']}],
  ['setUrl||setUsername||setPassword','Set connection details like JavaBean properties (setters!).','tick',{mem:['crs: url, user, pass set']}],
  ['setCommand','Set the SQL.','tick'],
  ['crs.execute()','Connects, fetches all rows, then DISCONNECTS.','whoosh',{mem:['crs = 3 rows in memory','connection: closed']}],
  ['while (crs.next())','Loop over rows offline.','click'],
  ['println','Print names.','ding',{con:'Pen · Notebook · Eraser'}]],'(imports javax.sql.rowset.* ; inside main throws Exception)'),
 ans:A({d:'<b>RowSet</b> (<code>javax.sql.RowSet</code>) is an interface that extends ResultSet and treats table data from a database as a <b>JavaBean</b> component.',
  pt:'Use of RowSet',p:['Makes database reading and updating simpler than plain ResultSet.','Sends events automatically when data or cursor position changes.'],
  tbl:{h:['Point','Connected RowSet (JdbcRowSet)','Disconnected RowSet (CachedRowSet, WebRowSet, etc.)'],r:[['DB connection','Keeps an active connection at all times','Fetches data, closes the connection, works offline'],['Saving changes','Saves updates to the DB right away','Saves later when you reconnect and call acceptChanges()'],['Network / memory','Needs continuous connection; less local memory','More memory to hold rows; saves DB connections'],['Serializable','Usually not sent over network','Serializable, can move across tiers'],['Best for','Steady, direct DB access','Distributed, mobile, low-connection apps']]}}),
 q:['Which RowSet keeps the connection open all the time?',['CachedRowSet','JdbcRowSet','WebRowSet'],1,'Connected = Constantly online.']});
console.log('unit2 written');
