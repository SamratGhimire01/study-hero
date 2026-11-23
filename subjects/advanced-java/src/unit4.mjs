import {mn,actors,S,flow,W,T,A,writer} from '../../../tools/author.mjs';
const card=writer('advanced-java');
const IMP='import java.io.*;\nimport javax.servlet.*;\nimport javax.servlet.http.*;\n';
// t01 Background
card({topic:'u4.t01',slug:'servlet-background',title:'Background (Why Servlets?)',marks:'[2.5]',
 link:'Units 1–3 ran on your own computer. Now Java runs on a web server.',nextWhy:'A servlet lives through a life cycle.',
 actors:actors(`
br|🌐|Browser|10|55
cgi|🐌|CGI (new process each time)|50|28
sv|⚡|Servlet (one object, many threads)|50|78
srv|🖥️|Web server|88|55`),
 scenes:[S('Browser sends a request','e.g. a form on a web page.','br srv','pop'),
  S('Old way: CGI 🐌','Server starts a NEW process for every request. Slow and heavy.','br srv cgi','err','cgi'),
  S('New way: Servlet ⚡','Loaded once. Each request gets a light thread, not a new process.','br srv cgi sv','whoosh','sv'),
  S('Servlet = Java on the server','Runs inside a servlet container (Tomcat). Builds the reply page.','br srv sv','ding','sv',{sv:'HTML reply'})],
 mn:[mn('Topic trick','CGI Crawls, Servlet Sprints',''),mn('Points trick (advantages)','Funny Penguins Skate Really Easily','Fast (threads) · Portable (Java) · Secure · Robust (memory managed) · Easy (Servlet API)')],
 ans:A({d:'A <b>Servlet</b> is a Java class that runs on a web server (inside a servlet container like Tomcat), receives HTTP requests and builds dynamic responses. Servlets replaced <b>CGI</b> programs.',
  tbl:{h:['CGI','Servlet'],r:[['New process for every request','One object; a new thread per request'],['Slow, uses more memory','Fast, uses less memory'],['Platform dependent (C, Perl)','Platform independent (Java)'],['Less secure','Secure (Java security)'],['Hard to share data between requests','Easy: sessions, context']]},
  pt:'Advantages of Servlets',p:['Fast (thread based)','Portable','Secure','Robust (garbage collection, exceptions)','Rich API (sessions, cookies)']}),
 q:['Why are servlets faster than CGI?',['They use C','They use threads, not a new process per request','They skip HTTP'],1,'CGI Crawls, Servlet Sprints.']});
// t02 Life cycle
card({topic:'u4.t02',slug:'servlet-life-cycle',title:'The Life Cycle of a Servlet',marks:'[2.5 / 5]',
 link:'Servlets are loaded once and reused.',nextWhy:'Now write our first simple servlet.',
 actors:actors(`
c|🏭|Container (Tomcat)|10|55
l|📥|Load class + new object|32|30
i|🔧|init()|52|55
s|🔁|service()|72|30
d|🧹|destroy()|90|55`),
 scenes:[S('The container controls everything','Tomcat decides when the servlet starts and ends.','c','pop'),
  S('1. Load & create object','Class is loaded and ONE object is made (first request or at startup).','c l','pop','l'),
  S('2. init(ServletConfig) – ONCE','Setup work: open a DB connection, read config.','c l i','tick','i',{i:'once'}),
  S('3. service() – EVERY request','Calls doGet() or doPost(). Many requests = many threads, same object.','c l i s','whoosh','s',{s:'again & again'}),
  S('4. destroy() – ONCE at the end','Clean up (close DB) before the server removes it.','c l i s d','ding','d')],
 mn:[mn('Topic trick (order)','I Study Daily','init() → service() → destroy()'),mn('Points trick (how often)','Once Many Once','init once · service many times · destroy once')],
 code:T('Program: see the life cycle',IMP+`
public class LifeServlet extends HttpServlet {
    public void init() throws ServletException {
        System.out.println("init: called once");
    }
    protected void service(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        res.getWriter().println("Hello from service()");
    }
    public void destroy() {
        System.out.println("destroy: called once");
    }
}`,[
  ['public class LifeServlet','Container loads the class and makes ONE object.','pop',{mem:['LifeServlet object']}],
  ['public void init','init() runs once.','tick',{con:'init: called once'}],
  ['protected void service','Request 1 arrives → service() runs.','whoosh',{user:'🌐 Browser request #1'}],
  ['res.getWriter','Reply is sent to the browser.','ding',{con:'Hello from service()'}],
  ['protected void service','Request 2 → service() again (same object, new thread).','whoosh',{user:'🌐 Browser request #2'}],
  ['public void destroy','Server stops → destroy() once.','tick',{con:'destroy: called once',user:'🛑 Server shutting down'}]],'(complete servlet)'),
 ans:A({d:'The <b>servlet life cycle</b> is the set of steps a servlet goes through from loading to removal, managed by the web server/container.',
  fig:'[Load & init()] ---> [service() for each request] ---> [destroy() on shutdown]',figT:'Diagram',
  pt:'Stages',p:['<b>Loading and instantiation</b>: container loads the class and creates one object.','<b>init(ServletConfig)</b>: runs once when the servlet starts (e.g. opening a DB connection).','<b>service(ServletRequest, ServletResponse)</b>: runs for every request and calls doGet() or doPost().','<b>destroy()</b>: runs once before shutting down to clean up resources.']}),
 q:['Which method runs for EVERY request?',['init()','service()','destroy()'],1,'Once Many Once.']});
// t03 Simple servlet
card({topic:'u4.t03',slug:'simple-servlet',title:'A Simple Servlet',marks:'[5]',
 link:'We know the life cycle. Now write one.',nextWhy:'The classes we used come from the Servlet API.',
 ...flow([
  ['🧬','extends','extends HttpServlet','Our class becomes a servlet.','pop'],
  ['📬','doGet','Override doGet(req, res)','Runs when the browser asks with GET.','click'],
  ['🏷️','Type','res.setContentType("text/html")','Tell the browser: HTML is coming.','tick'],
  ['🖊️','Writer','PrintWriter out = res.getWriter()','Our pen to write the reply.','tick'],
  ['📄','println','out.println("<h1>Hello</h1>")','The page appears in the browser.','ding'],
  ['🗺️','Map URL','@WebServlet("/hello") or web.xml','Connects a URL to the servlet.','whoosh']]),
 mn:[mn('Topic trick (steps)','Every Dog Takes Walks Proudly','Extend HttpServlet · doGet · Type (setContentType) · Writer · Print'),mn('Deploy trick','URL Map','@WebServlet("/hello") or <servlet-mapping> in web.xml')],
 code:T('Program: HelloServlet',IMP+`import javax.servlet.annotation.WebServlet;

@WebServlet("/hello")
public class HelloServlet extends HttpServlet {
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        res.setContentType("text/html");
        PrintWriter out = res.getWriter();
        out.println("<h1>Hello, Servlet!</h1>");
    }
}`,[
  ['@WebServlet','Map the URL /hello to this servlet.','tick',{mem:['/hello → HelloServlet']}],
  ['extends HttpServlet','Become an HTTP servlet.','pop'],
  ['protected void doGet','Browser opens http://localhost:8080/app/hello → container calls doGet.','whoosh',{user:'🌐 You open /hello'}],
  ['setContentType','Reply type = HTML.','tick'],
  ['getWriter','Get the pen.','tick',{mem:['out = PrintWriter']}],
  ['out.println','Write the page.','ding',{win:W('localhost:8080/app/hello',1,'l:Hello, Servlet!')}]],'(complete servlet)'),
 ans:A({d:'A <b>simple servlet</b> is a class that extends <b>HttpServlet</b> and overrides <b>doGet()</b> or <b>doPost()</b> to send an HTML response.',
  pt:'Steps',p:['Create a class that <b>extends HttpServlet</b>.','Override <b>doGet(HttpServletRequest, HttpServletResponse)</b>.','Set content type: <code>res.setContentType("text/html")</code>.','Get writer: <code>PrintWriter out = res.getWriter()</code>.','Write HTML with <code>out.println()</code>.','Map URL with <code>@WebServlet("/hello")</code> or web.xml, deploy on Tomcat.']}),
 q:['Which method gives the PrintWriter?',['req.getWriter()','res.getWriter()','out.getWriter()'],1,'Every Dog Takes Walks: W = Writer from response.']});
// t04 Servlet API
card({topic:'u4.t04',slug:'servlet-api',title:'The Servlet API',marks:'[2.5]',
 link:'We used HttpServlet, request and response. Where do they come from?',nextWhy:'Look inside package 1: javax.servlet.',
 ...flow([
  ['📦','javax.servlet','Package 1: javax.servlet','General classes for ANY protocol: Servlet, GenericServlet, ServletRequest…','pop'],
  ['🌐','javax.servlet.http','Package 2: javax.servlet.http','HTTP-only: HttpServlet, HttpServletRequest, HttpSession, Cookie…','whoosh'],
  ['🧬','Hierarchy','Servlet ← GenericServlet ← HttpServlet ← YourServlet','We always extend HttpServlet.','ding']]),
 mn:[mn('Topic trick','Two Boxes: General and HTTP','javax.servlet + javax.servlet.http'),mn('Hierarchy trick','Some Good Hens Yawn','Servlet → GenericServlet → HttpServlet → Your servlet')],
 ans:A({d:'The <b>Servlet API</b> is the set of interfaces and classes used to write servlets. It has two main packages: <b>javax.servlet</b> and <b>javax.servlet.http</b> (jakarta.servlet in new versions).',
  fig:'Servlet (interface)\n   ↑ implements\nGenericServlet (abstract class)\n   ↑ extends\nHttpServlet (abstract class)\n   ↑ extends\nMyServlet',figT:'Hierarchy',
  tbl:{h:['Package','Main types'],r:[['javax.servlet','Servlet, GenericServlet, ServletRequest, ServletResponse, ServletConfig, ServletContext, RequestDispatcher, ServletException'],['javax.servlet.http','HttpServlet, HttpServletRequest, HttpServletResponse, HttpSession, Cookie']]}}),
 q:['Which class do we usually extend?',['Servlet','GenericServlet','HttpServlet'],2,'Some Good Hens Yawn.']});
// t05 javax.servlet package
card({topic:'u4.t05',slug:'javax-servlet-package',title:'The javax.servlet Package',marks:'[5]',
 link:'The API has 2 packages. First the general one.',nextWhy:'Use ServletRequest to read form parameters.',
 ...flow([
  ['📜','Servlet','Servlet (interface)','init, service, destroy, getServletConfig, getServletInfo.','pop'],
  ['📨','Request','ServletRequest','Read data from client: getParameter().','tick'],
  ['📤','Response','ServletResponse','Send data: getWriter(), setContentType().','tick'],
  ['⚙️','Config','ServletConfig','Settings for ONE servlet (init parameters).','tick'],
  ['🏢','Context','ServletContext','Shared by ALL servlets of the web app.','whoosh'],
  ['🧱','Generic','GenericServlet (class)','Protocol-independent; you write service().','ding']]),
 mn:[mn('Topic trick (interfaces)','Some Rich Rats Can Cook','Servlet · Request · Response · Config · Context'),mn('Points trick (Config vs Context)','Config = One, Context = Common','ServletConfig per servlet; ServletContext shared by the whole app')],
 ans:A({d:'The <b>javax.servlet</b> package contains the general (protocol-independent) interfaces and classes of the Servlet API.',
  tbl:{h:['Interface / Class','Use'],r:[['Servlet','Main interface: init(), service(), destroy()'],['ServletRequest','Read client data (getParameter)'],['ServletResponse','Send response (getWriter, setContentType)'],['ServletConfig','Config of one servlet (getInitParameter)'],['ServletContext','Shared info for the whole web app'],['RequestDispatcher','forward() / include() to other resources'],['GenericServlet','Abstract class implementing Servlet'],['ServletException','Error from a servlet'],['ServletInputStream / OutputStream','Binary data']]}}),
 q:['Which object is shared by all servlets of an app?',['ServletConfig','ServletContext','ServletRequest'],1,'Config = One, Context = Common.']});
// t06 Reading parameters (+ factorial program)
card({topic:'u4.t06',slug:'reading-servlet-parameters',title:'Reading Servlet Parameters',marks:'[5 / Group C program]',
 link:'ServletRequest carries form data. Now read it.',nextWhy:'The HTTP package adds HTTP-specific classes.',
 ...flow([
  ['📝','Form','HTML form','<input name="num"> and a submit button.','pop'],
  ['🚀','Submit','User presses the button','Browser sends num=5 to the servlet.','click'],
  ['📨','getParameter','req.getParameter("num")','Returns "5" as a String (null if missing).','whoosh'],
  ['🔢','parseInt','Integer.parseInt("5")','Turn text into a number.','tick'],
  ['📄','Reply','Compute and print','out.println("Factorial of 5 is 120")','ding']]),
 mn:[mn('Topic trick','Get Param, Parse, Print',''),mn('Points trick (3 methods)','Pass Very Nicely','getParameter() · getParameterValues() · getParameterNames()')],
 code:T('Program: factorial servlet (Group C)',IMP+`
public class FactorialServlet extends HttpServlet {
    public void doPost(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        res.setContentType("text/html");
        PrintWriter out = res.getWriter();
        int n = Integer.parseInt(req.getParameter("num"));
        long fact = 1;
        for (int i = 1; i <= n; i++) {
            fact = fact * i;
        }
        out.println("<h3>Factorial of " + n + " is: " + fact + "</h3>");
    }
}`,[
  ['public void doPost','User types 5 in the form (index.html) and presses the button → POST → doPost runs.','whoosh',{user:'⌨️ num = 5, 👆 Calculate Factorial',mem:[]}],
  ['setContentType||getWriter','Prepare an HTML reply.','tick',{mem:['out = PrintWriter']}],
  ['req.getParameter','Read "num" → "5" → parseInt → 5.','pop',{mem:['n = 5']}],
  ['long fact = 1','Start with 1.','tick',{mem:['n = 5','fact = 1']}],
  ['fact = fact * i','Loop i = 1..5: 1, 2, 6, 24, 120.','tick',{mem:['n = 5','fact = 120']}],
  ['out.println','Send the answer to the browser.','ding',{win:W('FactorialServlet',1,'l:Factorial of 5 is: 120')}]],'(page index.html: <form action="FactorialServlet" method="post"> <input name="num"> <input type="submit"> )'),
 ans:A({d:'Servlet parameters are the values sent by an HTML form (or URL). A servlet reads them with methods of <b>ServletRequest</b>.',
  p:['<code>String getParameter(String name)</code>: one value (null if not sent).','<code>String[] getParameterValues(String name)</code>: many values (checkboxes).','<code>Enumeration getParameterNames()</code>: all parameter names.','Values are Strings; convert with Integer.parseInt().'],
  x:[['Input page (index.html)','<pre>&lt;form action="FactorialServlet" method="post"&gt;\n  Enter Number: &lt;input type="number" name="num" required&gt;\n  &lt;input type="submit" value="Calculate Factorial"&gt;\n&lt;/form&gt;</pre>']]}),
 q:['What does getParameter() return?',['int','String','Object[]'],1,'Get Param, Parse, Print: parse because it is a String.']});
// t07 javax.servlet.http
card({topic:'u4.t07',slug:'javax-servlet-http',title:'The javax.servlet.http Package',marks:'[5]',
 link:'javax.servlet is general. This package is for HTTP (the web).',nextWhy:'Use these classes to handle GET and POST.',
 ...flow([
  ['🧬','HttpServlet','HttpServlet','Abstract class: doGet, doPost, doPut, doDelete…','pop'],
  ['📨','Request','HttpServletRequest','Headers, cookies, session, method.','tick'],
  ['📤','Response','HttpServletResponse','Status, headers, addCookie, sendRedirect.','tick'],
  ['🗂️','Session','HttpSession','Remember a user across requests.','whoosh'],
  ['🍪','Cookie','Cookie','Small data stored in the browser.','ding']]),
 mn:[mn('Topic trick (5 types)','Happy Rabbits Run Swiftly Carrying','HttpServlet · Request · Response · Session · Cookie')],
 ans:A({d:'The <b>javax.servlet.http</b> package contains classes and interfaces for writing servlets that work with the <b>HTTP</b> protocol.',
  tbl:{h:['Type','Use / key methods'],r:[['HttpServlet (class)','doGet(), doPost(), doPut(), doDelete()'],['HttpServletRequest','getParameter(), getHeader(), getCookies(), getSession(), getMethod()'],['HttpServletResponse','setContentType(), addCookie(), sendRedirect(), setStatus()'],['HttpSession','setAttribute(), getAttribute(), invalidate()'],['Cookie (class)','getName(), getValue(), setMaxAge()'],['HttpSessionListener','Session created/destroyed events']]}}),
 q:['Which method sends the browser to another URL?',['forward()','sendRedirect()','addCookie()'],1,'Response does the redirect.']});
// t08 Handling HTTP requests/responses
card({topic:'u4.t08',slug:'http-requests-responses',title:'Handling HTTP Requests and Responses',marks:'[5]',
 link:'HttpServlet has doGet and doPost. When is each used?',nextWhy:'Responses can also store small data in the browser: cookies.',
 actors:actors(`
br|🌐|Browser|10|55
g|✉️|GET (data in URL)|50|28
p|📦|POST (data in body)|50|80
sv|⚡|Servlet|88|55`),
 scenes:[S('Browser talks with HTTP','Each request has a method: GET or POST (and PUT, DELETE…).','br sv','pop'),
  S('GET ✉️ = postcard','Data in the URL: ?name=Sam. Visible, small, bookmarkable. → doGet()','br g sv','whoosh','g',{g:'?name=Sam'}),
  S('POST 📦 = sealed parcel','Data in the request body. Hidden, large, for forms/passwords. → doPost()','br p sv','whoosh','p'),
  S('Servlet answers','res.setContentType, getWriter, println. Status 200 OK.','br g p sv','ding','sv',{sv:'200 OK'})],
 mn:[mn('Topic trick','GET = Postcard, POST = Parcel',''),mn('Points trick (difference)','URL Limited Bookmark vs Body Big Secure','GET: URL, limited size, bookmarkable · POST: body, large, more secure')],
 code:T('Program: one servlet for GET and POST',IMP+`
public class GreetServlet extends HttpServlet {
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        res.setContentType("text/html");
        res.getWriter().println("Hello " + req.getParameter("name") + " (GET)");
    }
    protected void doPost(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        doGet(req, res);
    }
}`,[
  ['protected void doGet','Browser opens /greet?name=Sam → GET → doGet.','whoosh',{user:'🌐 GET /greet?name=Sam',mem:['name = Sam (from URL)']}],
  ['res.getWriter','Reply is written.','ding',{win:W('/greet?name=Sam',1,'l:Hello Sam (GET)')}],
  ['protected void doPost','A form with method="post" → doPost.','whoosh',{user:'📦 POST form name=Sam'}],
  ['doGet(req, res)','Common trick: reuse doGet code.','ding']],'(complete servlet)'),
 ans:A({d:'An HTTP servlet handles a browser <b>request</b> in methods like <b>doGet()</b> and <b>doPost()</b>, and sends back a <b>response</b> (HTML, status, headers).',
  tbl:{h:['GET','POST'],r:[['Data in URL (query string)','Data in request body'],['Visible, less secure','Hidden, more secure'],['Limited size','Large data allowed'],['Can be bookmarked/cached','Not bookmarked'],['Handled by doGet()','Handled by doPost()']]},
  p:['Request: getParameter(), getHeader(), getMethod().','Response: setContentType(), getWriter(), sendRedirect(), setStatus().'],pt:'Main methods'}),
 q:['Which method is better for a password form?',['GET','POST','HEAD'],1,'POST = Parcel (sealed).']});
// t09 Cookies
card({topic:'u4.t09',slug:'cookies',title:'Using Cookies',marks:'[5]',
 link:'HTTP forgets the user after each request. Cookies help remember.',nextWhy:'A more powerful way to remember: sessions.',
 ...flow([
  ['🍪','Cookie','new Cookie("user", "Samrat")','A small name=value text.','pop'],
  ['⏰','setMaxAge','c.setMaxAge(3600)','Lives 1 hour (seconds). 0 = delete.','tick'],
  ['📤','addCookie','res.addCookie(c)','Sent to the browser, stored there.','whoosh'],
  ['🌐','Browser','Browser sends it back','With every next request to this site.','tick'],
  ['📨','getCookies','req.getCookies()','Read all cookies (array).','ding','Hi Samrat!']]),
 mn:[mn('Topic trick (steps)','Cows Always Add Grass','Create · Age (setMaxAge) · Add (addCookie) · Get (getCookies)'),mn('Points trick','Cookie = Client','stored on the client/browser, small text only')],
 code:T('Program: set and read a cookie',IMP+`
public class CookieServlet extends HttpServlet {
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        Cookie c = new Cookie("user", "Samrat");
        c.setMaxAge(3600);
        res.addCookie(c);
        PrintWriter out = res.getWriter();
        Cookie[] all = req.getCookies();
        if (all != null) {
            for (Cookie k : all) out.println(k.getName() + " = " + k.getValue());
        }
    }
}`,[
  ['new Cookie','Create a cookie user=Samrat.','pop',{mem:['c = user:Samrat']}],
  ['setMaxAge','Keep it for 3600 seconds.','tick',{mem:['c = user:Samrat, 1 hour']}],
  ['addCookie','Send it to the browser in the response.','whoosh',{con:'Browser stores: user=Samrat'}],
  ['getCookies','On the NEXT visit the browser sends it back; read all cookies.','whoosh',{user:'🌐 Next visit'}],
  ['out.println','Print name = value.','ding',{con:'user = Samrat'}]],'(complete servlet)'),
 ans:A({d:'A <b>cookie</b> is a small piece of text (name=value) stored in the browser by the server and sent back with every request. Used for remembering users.',
  pt:'Steps / methods',p:['Create: <code>Cookie c = new Cookie("user", "Samrat");</code>','Set life: <code>c.setMaxAge(seconds)</code> (0 deletes it).','Send: <code>res.addCookie(c);</code>','Read: <code>Cookie[] cs = req.getCookies();</code> then <code>getName()</code>, <code>getValue()</code>.'],
  x:[['Disadvantages','<ul><li>User can disable/delete cookies.</li><li>Only text, small size (~4 KB).</li><li>Not safe for secret data.</li></ul>']]}),
 q:['How do you delete a cookie?',['c.delete()','c.setMaxAge(0)','res.removeCookie()'],1,'Cows Always Add Grass: Age 0 = gone.']});
// t10 Session tracking
card({topic:'u4.t10',slug:'session-tracking',title:'Session Tracking (HttpSession)',marks:'[5]',
 link:'Cookies store data in the browser. Sessions store it on the server.',nextWhy:'Writing HTML in println is hard. JSP makes it easy.',
 actors:actors(`
u|🧑|User|10|55
srv|🖥️|Server|50|55
box|🗄️|HttpSession (locker)|85|55|h
id|🎫|JSESSIONID|30|25|h`),
 scenes:[S('HTTP is stateless','The server forgets you after each request.','u srv','err'),
  S('getSession() opens a locker 🗄️','Server makes an HttpSession with a unique ID.','u srv box','pop','box',{box:'id=A1B2'}),
  S('You get a ticket 🎫','The ID goes to the browser (cookie JSESSIONID or URL rewriting).','u srv box id','whoosh','id',null,{id:[15,25]}),
  S('setAttribute("cart", …)','Store data in your locker on the server.','u srv box','click','box',{box:'cart: 2 items'}),
  S('Next request: show ticket','Server finds your locker: getAttribute("cart").','u srv box id','ding','box'),
  S('Logout: invalidate()','Locker is emptied and closed.','u srv','tick','srv')],
 mn:[mn('Topic trick (4 techniques)','Cute Unicorns Hide Secrets','Cookies · URL rewriting · Hidden form fields · HttpSession'),mn('Points trick (7 methods)','Sam Gets Rice In India So Inexpensively','setAttribute · getAttribute · removeAttribute · getId · invalidate · setMaxInactiveInterval · isNew')],
 code:T('Program: count visits with a session',IMP+`
public class VisitServlet extends HttpServlet {
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        HttpSession session = req.getSession();
        Integer count = (Integer) session.getAttribute("count");
        if (count == null) count = 0;
        count++;
        session.setAttribute("count", count);
        res.getWriter().println("Visit " + count + ", session id " + session.getId());
    }
}`,[
  ['req.getSession()','Get this user’s session (make one if new).','pop',{user:'🌐 First visit',mem:['session id = A1B2 (new)']}],
  ['getAttribute("count")','Nothing saved yet → null → 0.','tick',{mem:['session A1B2','count = null → 0']}],
  ['count++','count = 1.','tick',{mem:['count = 1']}],
  ['setAttribute','Save it in the session (on the server).','click',{mem:['session A1B2: count = 1']}],
  ['println','Reply.','ding',{con:'Visit 1, session id A1B2'}],
  ['req.getSession()','Same user comes back → SAME session found by its ID.','whoosh',{user:'🌐 Second visit',mem:['session A1B2: count = 1']}],
  ['println','Now count is 2.','ding',{con:'Visit 2, session id A1B2'}]],'(complete servlet)'),
 ans:A({d:'<b>HttpSession</b> (<code>javax.servlet.http.HttpSession</code>) is an interface used to remember user data across multiple web requests, because HTTP by itself does not remember past requests.',
  pt:'Key methods',p:['<b>setAttribute(String name, Object value)</b> – saves data in the session under a name.','<b>getAttribute(String name)</b> – gets saved data by name (null if not there).','<b>removeAttribute(String name)</b> – deletes saved data by name.','<b>getId()</b> – returns the unique ID of the user’s session.','<b>invalidate()</b> – ends the session and clears all saved data (logout).','<b>setMaxInactiveInterval(int seconds)</b> – how long the session can stay idle before expiring.','<b>isNew()</b> – true if the session was just created.'],
  x:[['Session tracking techniques','Cookies · URL rewriting · Hidden form fields · HttpSession']]}),
 q:['Which method ends a session on logout?',['removeAttribute()','invalidate()','getId()'],1,'Sam Gets Rice In India: I = invalidate.']});
// t11 Intro JSP
card({topic:'u4.t11',slug:'introduction-to-jsp',title:'Introduction to JSP',marks:'[5]',
 link:'Servlets print HTML with println, which is messy.',nextWhy:'Now the JSP tags and objects we use.',
 ...flow([
  ['📄','JSP','JSP = HTML + small Java','hello.jsp: mostly HTML with Java tags inside.','pop'],
  ['🔄','Translate','1. Translation','Container turns the JSP into a servlet .java file (first request).','whoosh'],
  ['⚙️','Compile','2. Compilation','.java → .class','tick'],
  ['🔧','jspInit','3. jspInit()','Once.','tick'],
  ['🔁','_jspService','4. _jspService()','Every request.','whoosh'],
  ['🧹','jspDestroy','5. jspDestroy()','Once at the end.','ding']]),
 mn:[mn('Topic trick','JSP = HTML wearing a Java hat',''),mn('Points trick (life cycle)','The Cat Is Sleeping Deeply','Translate · Compile · jspInit · _jspService · jspDestroy')],
 code:T('Page: hello.jsp',`
<html>
<body>
  <h2>Hello from JSP</h2>
  <% int a = 5, b = 7; %>
  Sum = <%= a + b %><br>
  Time: <%= new java.util.Date() %>
</body>
</html>`,[
  ['<html>','A normal HTML page saved as hello.jsp.','tick',{mem:[]}],
  ['<h2>','Plain HTML goes straight to the browser.','tick',{win:W('hello.jsp',1,'l:Hello from JSP')}],
  ['<% int a','Scriptlet: Java code runs on the server.','pop',{mem:['a = 5','b = 7']}],
  ['<%= a + b %>','Expression: value is printed into the page.','ding',{win:W('hello.jsp',1,'l:Hello from JSP','l:Sum = 12')}],
  ['new java.util.Date','Server time is printed.','ding',{win:W('hello.jsp',1,'l:Hello from JSP','l:Sum = 12','l:Time: …')}]],'(JSP is turned into a servlet automatically)'),
 ans:A({d:'<b>JSP (JavaServer Pages)</b> is a server-side technology to create dynamic web pages by writing Java code inside HTML. Every JSP is converted into a servlet by the container.',
  pt:'Features',p:['Easy to write the view (HTML) part.','Automatic compilation; changes do not need manual redeploy.','Implicit objects (request, response, session, out…).','Supports tags, JSTL and JavaBeans (&lt;jsp:useBean&gt;).'],
  fig:'hello.jsp → (translate) → hello_jsp.java → (compile) → .class → jspInit() → _jspService() per request → jspDestroy()',figT:'JSP life cycle'}),
 q:['What does the container turn a JSP into?',['An applet','A servlet','A JavaBean'],1,'The Cat Is Sleeping: Translate first.']});
// t12 Using JSP
card({topic:'u4.t12',slug:'using-jsp',title:'Using JSP (Tags and Implicit Objects)',marks:'[5]',
 link:'We know what JSP is. Now its building blocks.',nextWhy:'Servlet or JSP: when to use which?',
 ...flow([
  ['📌','Directive','<%@ page import="java.util.*" %>','Settings for the page (page, include, taglib).','pop'],
  ['📝','Declaration','<%! int count = 0; %>','Declares variables/methods (class level).','tick'],
  ['⚙️','Scriptlet','<% count++; %>','Java statements run per request.','tick'],
  ['💬','Expression','<%= count %>','Prints a value.','ding'],
  ['🙈','Comment','<%-- hidden --%>','Not sent to the browser.','tick']]),
 mn:[mn('Topic trick (4 tags)','Dogs Don’t Steal Eggs','Directive <%@ · Declaration <%! · Scriptlet <% · Expression <%='),mn('Points trick (9 implicit objects)','Rich Rats Order Sweet Apples, Cats Prefer Purple Eggs','request · response · out · session · application · config · pageContext · page · exception')],
 code:T('Page: counter.jsp',`
<%@ page import="java.util.Date" %>
<%! int hits = 0; %>
<html><body>
<% hits++; %>
<p>Page hits: <%= hits %></p>
<p>Your session: <%= session.getId() %></p>
</body></html>`,[
  ['<%@ page','Directive: import Date.','pop',{mem:[]}],
  ['<%! int hits','Declaration: hits is a field of the generated servlet (shared).','tick',{mem:['hits = 0']}],
  ['<% hits++','Scriptlet runs each request.','click',{user:'🌐 Visit',mem:['hits = 1']}],
  ['<%= hits %>','Expression prints 1.','ding',{win:W('counter.jsp',1,'l:Page hits: 1')}],
  ['session.getId','"session" is an implicit object: ready to use, no need to create.','ding',{win:W('counter.jsp',1,'l:Page hits: 1','l:Your session: A1B2')}]],'(JSP page)'),
 ans:A({d:'Using JSP means writing pages with <b>JSP elements</b> (directives, declarations, scriptlets, expressions) and <b>implicit objects</b>.',
  tbl:{h:['Element','Syntax','Use'],r:[['Directive','&lt;%@ page / include / taglib %&gt;','Page settings'],['Declaration','&lt;%! … %&gt;','Declare variables/methods'],['Scriptlet','&lt;% … %&gt;','Java statements'],['Expression','&lt;%= … %&gt;','Print a value'],['Comment','&lt;%-- … --%&gt;','Hidden comment'],['Action','&lt;jsp:include&gt;, &lt;jsp:forward&gt;, &lt;jsp:useBean&gt;','Built-in actions']]},
  x:[['Implicit objects (9)','request, response, out, session, application, config, pageContext, page, exception']]}),
 q:['Which tag prints a value into the page?',['<%! %>','<% %>','<%= %>'],2,'Dogs Don’t Steal Eggs: E = Expression.']});
// t13 JSP vs Servlet
card({topic:'u4.t13',slug:'jsp-vs-servlet',title:'Comparing JSP with Servlet',marks:'[3]',
 link:'We know both servlets and JSP.',nextWhy:'Big apps use frameworks built on these.',
 actors:actors(`
sv|🧑‍🍳|Servlet (cook: logic)|25|55
jsp|🧑‍🎨|JSP (waiter: view)|75|55`),
 scenes:[S('Two workers in one web app','Both run on the server and become servlets in the end.','sv jsp','pop'),
  S('Servlet = Java with HTML inside','out.println("<h1>…") – good for logic, bad for big pages.','sv jsp','tick','sv',{sv:'logic'}),
  S('JSP = HTML with Java inside','Easy to design pages; has implicit objects.','sv jsp','tick','jsp',{jsp:'view'}),
  S('Best: use both (MVC)','Servlet = controller, JSP = view.','sv jsp','ding')],
 mn:[mn('Topic trick','Servlet Cooks, JSP Serves','servlet = logic/controller, JSP = view'),mn('Points trick (5 differences)','Smart Rabbits Can Dance Inside','Style · Role · Compilation · Design · Implicit objects')],
 ans:A({d:'A <b>Servlet</b> is a server-side Java class that handles requests and builds responses in Java code, while <b>JSP</b> is an HTML page with embedded Java tags that turns into a servlet behind the scenes.',
  tbl:{h:['Point','Servlet','JSP'],r:[['1. Writing style','Prints HTML inside Java (out.println)','Puts Java tags inside HTML'],['2. Role','Request routing and business logic','Designs and displays the UI (view)'],['3. Compilation','Compiled directly to .class','Translated to a servlet, then compiled by container'],['4. Page design','Hard; UI changes need Java edits','Easy; front-end work is cleaner'],['5. Implicit objects','Get request, response, session via parameters/calls','Built-in implicit objects (request, response, session, out)']]}}),
 q:['Which is better for designing a big HTML page?',['Servlet','JSP'],1,'Servlet Cooks, JSP Serves.']});
// t14 Web frameworks
card({topic:'u4.t14',slug:'java-web-frameworks',title:'Java Web Frameworks',marks:'[2.5]',
 link:'Servlets + JSP get big and repetitive.',nextWhy:'Unit 5: RMI, calling methods on another computer.',
 ...flow([
  ['🌱','Spring','Spring / Spring Boot','Most popular. MVC, dependency injection, easy setup.','ding'],
  ['🏛️','Struts','Apache Struts','MVC framework using actions.','tick'],
  ['🧩','JSF','JSF (JavaServer Faces)','Component-based UI from Oracle.','tick'],
  ['🗃️','Hibernate','Hibernate','ORM: maps Java objects to DB tables (used with web apps).','pop']]),
 mn:[mn('Topic trick (4 names)','Silly Students Jump High','Spring · Struts · JSF · Hibernate'),mn('Points trick (why)','More Speed, Less Repeat','MVC structure · faster development · less boilerplate · reuse')],
 ans:A({d:'A <b>Java web framework</b> is a ready-made structure of libraries that makes building web applications faster and cleaner than writing raw servlets and JSP.',
  tbl:{h:['Framework','Key idea'],r:[['Spring MVC / Spring Boot','MVC, dependency injection, auto configuration'],['Struts','Action-based MVC'],['JSF','Component-based UI, event driven'],['Hibernate','ORM: Java objects ↔ database tables'],['Others','Play, Grails, Vaadin']]},
  pt:'Advantages',p:['Follow MVC, so code is organised.','Less repeated (boilerplate) code.','Built-in security, validation, database support.']}),
 q:['Which framework is mainly ORM (objects ↔ tables)?',['Spring MVC','Hibernate','JSF'],1,'Silly Students Jump High: H = Hibernate = database.']});
console.log('unit4 written');
