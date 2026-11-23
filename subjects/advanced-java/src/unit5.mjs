import {mn,actors,S,flow,W,T,A,writer} from '../../../tools/author.mjs';
const card=writer('advanced-java');
const ADDER=`
import java.rmi.*;
import java.rmi.server.*;
import java.rmi.registry.*;

interface Adder extends Remote {
    int add(int a, int b) throws RemoteException;
}

class AdderImpl extends UnicastRemoteObject implements Adder {
    AdderImpl() throws RemoteException { super(); }
    public int add(int a, int b) throws RemoteException { return a + b; }
}

class Server {
    public static void main(String[] args) throws Exception {
        Registry reg = LocateRegistry.createRegistry(1099);
        reg.rebind("adder", new AdderImpl());
        System.out.println("Server ready");
    }
}

class Client {
    public static void main(String[] args) throws Exception {
        Registry reg = LocateRegistry.getRegistry("localhost", 1099);
        Adder a = (Adder) reg.lookup("adder");
        System.out.println("Sum = " + a.add(5, 7));
    }
}`;
// t01
card({topic:'u5.t01',slug:'what-is-rmi',title:'What is RMI?',marks:'[2.5]',
 link:'Unit 4: browser talks to server. Now: one Java program calls a method in ANOTHER Java program.',nextWhy:'There are two sides: client and server.',
 actors:actors(`
a|💻|JVM 1 (client)|15|55
b|🖥️|JVM 2 (server)|85|55
obj|🧠|Remote object|85|25
call|📞|add(5,7)|15|30|h`),
 scenes:[S('Two Java programs, two computers','Each runs in its own JVM.','a b obj','pop'),
  S('Client wants a method that lives far away','The object is on the server.','a b obj','tick','obj'),
  S('RMI: call it like a local method 📞','Client writes a.add(5,7); RMI does the network work.','a b obj call','whoosh','call',null,{call:[60,30]}),
  S('Result comes back','12 returns to the client as if it ran locally.','a b obj','ding','a',{a:'12'})],
 mn:[mn('Topic trick','RMI = Remote Method Invocation = Phone call to an object',''),mn('Points trick (features)','Just Open Some Rooms','Java-to-Java only · Objects passed (serialization) · Stub/Skeleton hide network · Registry to find objects')],
 ans:A({d:'<b>RMI (Remote Method Invocation)</b> lets a Java program in one JVM call a method on an object running in another JVM over a network.',
  p:['Package <b>java.rmi</b>.','Works only between Java programs (Java-to-Java).','Uses <b>stub</b> (client) and <b>skeleton</b> (server) to hide network details.','Objects are passed using <b>serialization</b>.','<b>RMI Registry</b> is used to find remote objects.','Used for distributed applications (banking, chat, remote calculators).'],
  fig:'[Client JVM] --- method call over network ---> [Server JVM: Remote Object]'}),
 q:['RMI works between…',['Any two languages','Java and Java (two JVMs)','Browser and server'],1,'Just Open Some Rooms: J = Java only.']});
// t02 Roles
card({topic:'u5.t02',slug:'roles-client-server',title:'The Roles of Client and Server',marks:'[2.5]',
 link:'RMI has two sides.',nextWhy:'How does one remote call actually travel?',
 ...flow([
  ['🏗️','Create','Server: create remote object','new AdderImpl()','pop'],
  ['📤','Export','Server: export it','extends UnicastRemoteObject (ready to receive calls).','tick'],
  ['📒','Register','Server: register a name','registry.rebind("adder", obj)','click'],
  ['🔎','Lookup','Client: look it up','registry.lookup("adder") → gets a stub','whoosh'],
  ['📞','Call','Client: call methods','stub.add(5,7) → result 12','ding']]),
 mn:[mn('Server trick','Cows Eat Roses','Create · Export · Register'),mn('Client trick','Look then Call','lookup() then call the method')],
 ans:A({d:'In RMI, the <b>server</b> creates and offers a remote object, and the <b>client</b> finds that object and calls its methods.',
  tbl:{h:['Server role','Client role'],r:[['Creates the remote object','Looks up the object in the RMI registry'],['Exports it (UnicastRemoteObject)','Gets a stub (proxy) for it'],['Registers it with a name (bind/rebind)','Calls remote methods on the stub'],['Waits for calls and runs methods','Receives results or RemoteException']]}}),
 q:['Who registers the object in the registry?',['Client','Server'],1,'Cows Eat Roses: Register = server.']});
// t03 Remote method calls
card({topic:'u5.t03',slug:'remote-method-calls',title:'Remote Method Calls',marks:'[5]',
 link:'Client calls, server runs. What happens in between?',nextWhy:'Stubs do the packing: marshalling.',
 ...flow([
  ['📞','Call stub','Client calls the stub','a.add(5, 7) — looks local.','click'],
  ['🧳','Pack','Stub packs the arguments','Marshalling: method name + 5, 7 → bytes.','pop'],
  ['🌐','Send','Sent over the network','TCP/IP to the server.','whoosh'],
  ['📭','Unpack','Server side unpacks','Unmarshalling: bytes → 5, 7.','tick'],
  ['⚙️','Run','Real method runs','AdderImpl.add(5,7) = 12','ding'],
  ['↩️','Return','Result packed and sent back','Stub unpacks 12 and returns it (or throws RemoteException).','ding']]),
 mn:[mn('Topic trick (6 steps)','Can People Send Unusual Rare Rubies','Call stub · Pack · Send · Unpack · Run · Return'),mn('Error trick','Every remote method throws RemoteException','')],
 ans:A({d:'A <b>remote method call</b> is a call from a client to a method of an object in another JVM. The stub and the server side do all the network work.',
  pt:'Steps',p:['Client calls a method on the <b>stub</b>.','Stub <b>marshals</b> (packs) the method ID and parameters.','Data is sent over the network (TCP/IP).','Server side (skeleton) <b>unmarshals</b> the parameters.','The real method runs on the remote object.','Return value is marshalled back; the stub unmarshals and returns it to the client.'],
  fig:'Client → Stub (marshal) → Network → Skeleton (unmarshal) → Remote Object\nClient ← Stub (unmarshal) ← Network ← Skeleton (marshal result) ←'}),
 q:['What is "marshalling"?',['Finding the object','Packing parameters into bytes to send','Starting the registry'],1,'Pack the suitcase.']});
// t04 Stubs & marshalling
card({topic:'u5.t04',slug:'stubs-marshalling',title:'Stubs and Parameter Marshalling',marks:'[5]',
 link:'We saw a call travel. The stub is the traveller.',nextWhy:'Now the full RMI programming model (architecture).',
 actors:actors(`
c|🧑|Client|10|55
st|📞|Stub (proxy)|35|55
bag|🧳|marshalled bytes|35|25|h
sk|🛎️|Skeleton|70|55
o|🧠|Remote object|92|55`),
 scenes:[S('Stub = local stand-in 📞','It has the same methods as the remote object, so the client thinks it is local.','c st sk o','pop','st'),
  S('Marshalling = packing the suitcase 🧳','Parameters are turned into bytes (serialization).','c st bag sk o','pop','bag'),
  S('Bytes travel to the server','','c st bag sk o','whoosh','bag',null,{bag:[70,25]}),
  S('Unmarshalling = unpacking','Skeleton/server unpacks and calls the real object.','c st sk o','tick','sk'),
  S('Rules: what is copied?','Primitives and Serializable objects: COPIED. Remote objects: passed as a STUB (reference).','c st sk o','ding','st')],
 mn:[mn('Topic trick','Stub = Stand-in, Marshal = Pack',''),mn('Points trick (passing rules)','Primitives Copy, Objects Copy, Remotes Reference','int/double by value · Serializable objects by copy · Remote objects by stub reference')],
 ans:A({d:'A <b>stub</b> is a client-side proxy for a remote object. <b>Parameter marshalling</b> is packing method parameters into a byte stream to send them over the network (unmarshalling is unpacking them).',
  p:['Stub implements the same remote interface as the real object.','Stub: starts connection, marshals parameters, sends, waits, unmarshals result.','Uses Java <b>serialization</b> for objects.','Primitive types are sent by value.','Non-remote objects must be <b>Serializable</b> and are sent as copies.','Remote objects are sent as stubs (by reference).','Since Java 5 stubs are created automatically (no rmic needed).']}),
 q:['How is a non-remote object parameter passed in RMI?',['By reference','By copy (must be Serializable)','It cannot be passed'],1,'Objects Copy, Remotes Reference.']});
// t05 RMI programming model / architecture
card({topic:'u5.t05',slug:'rmi-architecture',title:'The RMI Programming Model (Architecture)',marks:'[5 / 10]',
 link:'Stubs carry calls. Here is the whole layered architecture.',nextWhy:'Step 1 of the model: interface and implementation.',
 actors:actors(`
cl|🧑|Client|8|55
st|📞|Stub|26|55
rrl|🧭|RRL|44|55
tr|🚚|Transport|62|55
sk|🛎️|Skeleton|78|55
ob|🧠|Object|93|55
reg|📒|Registry|78|18|h
msg|✉️||8|38|h`),
 scenes:[S('The expert is far away 🌍','Remote object lives in another JVM.','cl ob','pop'),
  S('First, the phonebook 📒','RMI Registry: server registers a name, client looks it up.','cl ob reg','tick','reg',{reg:'name → object'}),
  S('Client calls the Stub 📞','Stub = local stand-in. Packs arguments.','cl st ob msg','click','st',null,{msg:[26,40]}),
  S('Remote Reference Layer 🧭','Manages the reference to the remote object and the connection.','cl st rrl ob msg','tick','rrl',null,{msg:[44,40]}),
  S('Transport Layer 🚚 (TCP/IP)','Carries the data over the network.','cl st rrl tr ob msg','whoosh','tr',null,{msg:[62,40]}),
  S('Skeleton receives 🛎️','Unpacks and calls the REAL method.','cl st rrl tr sk ob msg','pop','sk',null,{msg:[78,40]}),
  S('Answer travels back ↩️','Object → Skeleton → Transport → RRL → Stub → Client.','cl st rrl tr sk ob msg','ding','cl',{cl:'Got it!'},{msg:[8,40]})],
 mn:[mn('Topic trick (client path)','Cats Sit Right There','Client → Stub → RRL → Transport'),mn('Server path','Transport Serves Objects','Transport → Skeleton → Object'),mn('Program steps','I Insist Rats Sing Carols','Interface · Implementation · Registry · Server · Client'),mn('Roles','Stub = phone, Skeleton = receptionist, Registry = phonebook','')],
 ans:A({d:'<b>RMI (Remote Method Invocation)</b> lets a Java program in one JVM call a method on an object running in another JVM over a network. Its architecture has layers on both client and server.',
  fig:'+--------+    +------+    +--------------+    +-----------+\n| Client | -> | Stub | -> | Remote Ref.  | -> | Transport |\n+--------+    +------+    | Layer (RRL)  |    |  Layer    |\n                          +--------------+    +-----------+\n                                                   | network\n+---------------+    +----------+    +--------------+    +-----------+\n| Remote Object | <- | Skeleton | <- | Remote Ref.  | <- | Transport |\n+---------------+    +----------+    | Layer (RRL)  |    |  Layer    |\n                                     +--------------+    +-----------+',figT:'Architecture Diagram',
  pt:'Key parts',p:['<b>Client &amp; Server</b>: client calls remote methods; server holds and runs the remote object.','<b>Stub</b> (client side): local stand-in; packs arguments and unpacks return values or errors.','<b>Skeleton</b> (server side): receives calls, unpacks arguments, runs the method, sends back the result. (Old; removed after Java 1.2 but still asked.)','<b>Remote Reference Layer</b>: handles remote object references and how connections are made.','<b>Transport Layer</b>: sends/receives raw data (TCP/IP).','<b>RMI Registry</b>: phonebook where the server registers the object name and the client finds it.'],
  x:[['Steps to build an RMI app','<ol><li>Define remote interface</li><li>Implement it</li><li>Start registry</li><li>Server binds object</li><li>Client looks up and calls</li></ol>']]}),
 q:['Which layer carries data over TCP/IP?',['Stub','Remote Reference Layer','Transport Layer'],2,'Cats Sit Right There: T = Transport last.']});
// t06 Interfaces & implementations
card({topic:'u5.t06',slug:'interfaces-implementations',title:'Interfaces and Implementations',marks:'[5]',
 link:'Step 1 and 2 of the RMI model.',nextWhy:'Then register the object in the RMI registry.',
 ...flow([
  ['📜','Interface','Remote interface','interface Adder extends Remote','pop'],
  ['⚠️','Exception','Every method throws RemoteException','Network can fail.','err'],
  ['🏗️','Impl','Implementation class','class AdderImpl extends UnicastRemoteObject implements Adder','tick'],
  ['🚪','Constructor','Constructor throws RemoteException','super() exports the object.','tick'],
  ['🤝','Shared','Client knows only the interface','Server has the implementation.','ding']]),
 mn:[mn('Topic trick (interface rules)','Ever Ready Programmers','Extends Remote · RemoteException on every method · Public'),mn('Impl trick','Ugly Robots Implement','extends UnicastRemoteObject · implements interface · constructor throws RemoteException')],
 code:T('Program: remote interface and implementation',`
import java.rmi.*;
import java.rmi.server.*;

interface Adder extends Remote {
    int add(int a, int b) throws RemoteException;
}

class AdderImpl extends UnicastRemoteObject implements Adder {
    AdderImpl() throws RemoteException {
        super();
    }
    public int add(int a, int b) throws RemoteException {
        return a + b;
    }
}`,[
  ['interface Adder extends Remote','Remote interface: marks methods that can be called from another JVM.','pop',{mem:[]}],
  ['int add(int a, int b) throws','Each method must throw RemoteException.','err'],
  ['class AdderImpl extends UnicastRemoteObject','Implementation; UnicastRemoteObject makes it able to receive calls.','tick',{mem:['AdderImpl (exported)']}],
  ['super();','Constructor exports the object (it may fail → RemoteException).','tick'],
  ['return a + b','The real work.','ding']],'(the client only needs the Adder interface)'),
 ans:A({d:'In RMI, the <b>remote interface</b> declares the methods a client may call remotely, and the <b>implementation class</b> on the server provides the real code.',
  p:['Remote interface <b>extends java.rmi.Remote</b>.','Every remote method <b>throws RemoteException</b>.','Implementation <b>extends UnicastRemoteObject</b> (or uses UnicastRemoteObject.exportObject()).','Implementation constructor throws RemoteException.','Client works only with the interface type (via the stub).']}),
 q:['A remote interface must extend…',['Serializable','Remote','Runnable'],1,'Ever Ready Programmers: Extends Remote.']});
// t07 Registry
card({topic:'u5.t07',slug:'rmi-registry',title:'The RMI Registry',marks:'[2.5]',
 link:'We have a remote object. How does the client find it?',nextWhy:'What can we pass to and from remote methods?',
 ...flow([
  ['📒','Registry','RMI Registry = phonebook','A naming service, default port 1099.','pop'],
  ['▶️','Start','Start it','Command: rmiregistry, or LocateRegistry.createRegistry(1099)','tick'],
  ['✍️','rebind','Server: rebind("adder", obj)','Write the name in the phonebook.','click'],
  ['🔎','lookup','Client: lookup("adder")','Read the name → get a stub.','whoosh'],
  ['🗑️','unbind','unbind / list','Remove a name / list all names.','ding']]),
 mn:[mn('Topic trick','Registry = Phonebook on port 1099',''),mn('Points trick (5 methods)','Big Rabbits Usually Look Lazy','bind · rebind · unbind · lookup · list')],
 code:T('Program: server registers, client looks up',`
import java.rmi.registry.*;
public class RegistryDemo {
    public static void main(String[] args) throws Exception {
        Registry reg = LocateRegistry.createRegistry(1099);
        System.out.println("Registry running on 1099");
        String[] names = reg.list();
        System.out.println("Names: " + names.length);
    }
}`,[
  ['createRegistry','Start a registry inside this JVM on port 1099.','pop',{mem:['registry @1099','names: []']}],
  ['println("Registry','Running.','ding',{con:'Registry running on 1099'}],
  ['reg.list()','list() returns all registered names (none yet; server would call rebind).','tick'],
  ['println("Names','0 names.','ding',{con:'Names: 0'}]],'(Naming.rebind("rmi://localhost/adder", obj) is the older URL style)'),
 ans:A({d:'The <b>RMI Registry</b> is a simple naming service (like a phonebook) where a server registers remote objects by name, and clients look them up. Default port is <b>1099</b>.',
  pt:'Methods (Registry / Naming)',p:['<b>bind(name, obj)</b>: add a name (error if it exists).','<b>rebind(name, obj)</b>: add or replace.','<b>unbind(name)</b>: remove.','<b>lookup(name)</b>: get the stub.','<b>list()</b>: all names.'],
  x:[['Start the registry','<code>rmiregistry 1099</code> (command) or <code>LocateRegistry.createRegistry(1099)</code> (code).']]}),
 q:['Default port of the RMI registry?',['8080','1099','3306'],1,'Phonebook on port 1099.']});
// t08 Params & return values
card({topic:'u5.t08',slug:'parameters-return-values',title:'Parameters and Return Values in Remote Methods',marks:'[5]',
 link:'Calls carry parameters and results across the network.',nextWhy:'Can a remote object sleep until needed? Activation.',
 ...flow([
  ['🔢','Primitive','Primitives (int, double)','Sent by VALUE (a copy).','tick'],
  ['📦','Serializable','Normal objects','Must be Serializable. Sent as a COPY. Changes on the server do not affect the client’s object.','pop'],
  ['📞','Remote','Remote objects','Sent as a STUB (reference). Calls go back to the original object.','whoosh'],
  ['🚫','Error','Not serializable, not remote?','Cannot be sent → error (MarshalException).','err'],
  ['↩️','Return','Return values','Same rules as parameters.','ding']]),
 mn:[mn('Topic trick','Copy Unless Remote',''),mn('Points trick (3 rules)','Primitives Copy, Objects Copy, Remotes Reference','')],
 ans:A({d:'Parameters and return values of remote methods are sent across the network by <b>marshalling</b>. How they are passed depends on their type.',
  tbl:{h:['Type','How passed','Note'],r:[['Primitive (int, double…)','By value','Copy'],['Serializable object (String, ArrayList, own class)','By value (serialized copy)','Changes on one side not seen by the other'],['Remote object','By reference (stub)','Calls go to the original object'],['Neither','Cannot be passed','Throws MarshalException']]},
  p:['Return values follow the same rules.','Object classes must be available on both sides (or downloadable).'],pt:'Points'}),
 q:['How is a remote object passed as a parameter?',['By copy','By reference (as a stub)','It is not allowed'],1,'Copy Unless Remote.']});
// t09 Activation
card({topic:'u5.t09',slug:'remote-object-activation',title:'Remote Object Activation',marks:'[2.5]',
 link:'Normal remote objects run all the time and use memory.',nextWhy:'Now build a full client/server RMI app.',
 ...flow([
  ['😴','Sleep','Object sleeps','Not running, not using memory.','tick'],
  ['📞','Call','A client calls it','','click'],
  ['⏰','rmid','Activation daemon (rmid) wakes it','Creates/loads the object on demand.','whoosh'],
  ['⚙️','Run','Method runs','Then it may become inactive again.','ding']]),
 mn:[mn('Topic trick','Activation = Alarm clock','object wakes up only when called'),mn('Points trick (parts)','Always Read Daily','Activatable class · rmid daemon · Descriptor (ActivationDesc)')],
 ans:A({d:'<b>Remote object activation</b> lets a remote object be started <b>on demand</b> (only when a client calls it) instead of running all the time.',
  p:['Uses package <b>java.rmi.activation</b>.','Object extends <b>Activatable</b>.','The activation daemon <b>rmid</b> starts the object when needed.','Registered with an <b>ActivationDesc</b> (descriptor).','Saves memory and server resources; objects survive server restarts.','Note: deprecated in Java 15 and removed in Java 17, but it is in the syllabus.']}),
 q:['Which daemon starts activatable objects?',['rmiregistry','rmid','javac'],1,'Alarm clock = rmid.']});
// t10 Client/server app
card({topic:'u5.t10',slug:'rmi-client-server-app',title:'Simple Client/Server Application using RMI',marks:'[10 program]',
 link:'We know every part. Now one complete program.',nextWhy:'Finally: compare RMI with CORBA.',
 ...flow([
  ['📜','Interface','1. Interface Adder','extends Remote','pop'],
  ['🏗️','Impl','2. AdderImpl','extends UnicastRemoteObject','tick'],
  ['📒','Registry','3. Server starts registry + rebind','name "adder"','click'],
  ['🔎','Lookup','4. Client: getRegistry + lookup','gets a stub','whoosh'],
  ['📞','Call','5. Client calls add(5, 7)','prints Sum = 12','ding']]),
 mn:[mn('Topic trick (5 steps)','I Insist Rats Sing Carols','Interface · Implementation · Registry · Server · Client')],
 code:T('Program: RMI Adder (complete)',ADDER,[
  ['interface Adder','1. Remote interface.','pop',{mem:[]}],
  ['class AdderImpl','2. Implementation (exported by UnicastRemoteObject).','tick'],
  ['LocateRegistry.createRegistry','3. Server: start registry on 1099.','pop',{user:'▶️ Run Server',mem:['registry @1099']}],
  ['reg.rebind','Register the object as "adder".','click',{mem:['registry: adder → AdderImpl']}],
  ['println("Server ready")','Server waits for calls.','ding',{con:'Server ready'}],
  ['LocateRegistry.getRegistry','4. Client: find the registry.','whoosh',{user:'▶️ Run Client'}],
  ['reg.lookup','Get a stub for "adder".','pop',{mem:['a = stub(Adder)']}],
  ['a.add(5, 7)','5. Remote call → server computes 12 → back to client.','ding',{con:'Sum = 12'}]],'(run Server first, then Client)'),
 ans:A({d:'A simple RMI application has a <b>remote interface</b>, an <b>implementation</b>, a <b>server</b> that registers the object, and a <b>client</b> that looks it up and calls it.',
  pt:'Steps',p:['Create the remote interface (extends Remote).','Implement it (extends UnicastRemoteObject).','Server: create the registry and rebind the object.','Client: look up the object and call methods.','Compile all, run server, then run client.'],code:ADDER.trim()}),
 q:['What does the client call to get the stub?',['rebind()','lookup()','createRegistry()'],1,'I Insist Rats Sing Carols: client looks up.']});
// t11 RMI vs CORBA
card({topic:'u5.t11',slug:'rmi-vs-corba',title:'Comparing RMI with CORBA',marks:'[2.5 / 5]',
 link:'RMI is Java-only. What if programs use different languages?',nextWhy:'',
 next:'End of the syllabus. Go to EXAM-RESCUE and the memory sheets.',
 actors:actors(`
j|☕|Java|15|30
c|🅲|C++|15|80
orb|🚌|ORB (bus)|50|55
idl|📜|IDL contract|50|20|h
py|🐍|Python|85|55`),
 scenes:[S('RMI: Java ↔ Java only','Both sides must be Java.','j','tick','j'),
  S('CORBA: many languages','Java, C++, Python… can talk to each other.','j c py','pop'),
  S('IDL = common contract 📜','Interface Definition Language: every language understands it.','j c py idl','tick','idl'),
  S('ORB = the bus 🚌','Object Request Broker carries requests and replies (protocol IIOP).','j c py orb','whoosh','orb'),
  S('RMI simpler, CORBA bigger','RMI: easy, Java only. CORBA: language-independent, more complex.','j c py orb','ding')],
 mn:[mn('Topic trick (CORBA parts)','I Order Ice-cream','IDL · ORB · IIOP'),mn('Points trick (difference)','RMI = Really My Island (Java only), CORBA = Can Open to Rest of All','')],
 ans:A({d:'<b>CORBA (Common Object Request Broker Architecture)</b> is a standard that lets programs written in different languages on different machines talk to each other over a network.',
  pt:'CORBA key points',p:['Uses <b>IDL</b> (Interface Definition Language) so any language can understand the interface.','Uses an <b>ORB</b> (Object Request Broker) to pass requests and replies between client and object.','Works across different languages and operating systems (protocol IIOP).'],
  tbl:{h:['Point','RMI','CORBA'],r:[['Language','Java only','Any language (C++, Java, Python…)'],['Interface','Java interface','IDL'],['Protocol','JRMP (or IIOP)','IIOP'],['Complexity','Simple','More complex'],['Objects passed','By value (serialization) or reference','Mostly by reference'],['Garbage collection','Distributed GC','No distributed GC']]}}),
 q:['What does CORBA use so different languages understand an interface?',['JSP','IDL','JDBC'],1,'I Order Ice-cream: IDL first.']});
console.log('unit5 written');
