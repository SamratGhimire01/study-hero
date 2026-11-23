import {mn,actors,S,flow,W,T,A,writer} from '../../../tools/author.mjs';
const card=writer('advanced-java');
const BEAN=`
public class Student implements java.io.Serializable {
    private String name;
    private int age;
    public Student() { }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
}`;
// t01
card({topic:'u3.t01',slug:'what-is-java-bean',title:'What Is a Java Bean?',marks:'[2.5]',
 link:'Unit 2 is done (a RowSet is a bean). Now: what is a bean?',nextWhy:'Why should we use beans? Their advantages.',
 ...flow([
  ['🫘','Bean','A reusable Java class','Like a LEGO block you can plug into many programs and GUI tools.','pop'],
  ['🚪','No-arg','Rule 1: public no-arg constructor','Tools can create it with new Student().','tick'],
  ['🔒','Private','Rule 2: private fields','Data is hidden.','tick'],
  ['🔑','Get/Set','Rule 3: public getters/setters','getName(), setName(), isActive() for boolean.','click'],
  ['💾','Serializable','Rule 4: implements Serializable','So its state can be saved and sent.','ding']]),
 mn:[mn('Topic trick','Bean = LEGO block','reusable component'),mn('Points trick (4 rules)','No Private Gate Shuts','No-arg constructor · Private fields · Getters/setters · Serializable')],
 code:T('Program: Student bean',BEAN,[
  ['public class Student','A public class that implements Serializable (rule 4).','pop',{mem:[]}],
  ['private String name','Private fields (rule 2): name and age are hidden.','tick',{mem:['name (private)','age (private)']}],
  ['public Student()','Public no-argument constructor (rule 1).','tick'],
  ['getName||setName','Getter and setter for property "name" (rule 3).','click',{mem:['property: name (read/write)']}],
  ['getAge||setAge','Property "age". Tools find properties by these names.','ding',{mem:['property: name','property: age']}]],'(complete bean)'),
 ans:A({d:'A <b>JavaBean</b> is a reusable Java class (software component) that follows simple rules so tools and programs can use it easily.',
  pt:'Rules of a JavaBean',p:['Has a <b>public no-argument constructor</b>.','Fields (properties) are <b>private</b>.','Properties are accessed with public <b>getter/setter</b> methods (<code>getX()</code>, <code>setX()</code>, <code>isX()</code> for boolean).','Implements <b>Serializable</b> so its state can be saved.','Can fire and listen to <b>events</b>.'],code:BEAN.trim()}),
 q:['Which is NOT a JavaBean rule?',['Public no-arg constructor','Public fields','Getters and setters'],1,'No Private Gate Shuts: fields are PRIVATE.']});
// t02
card({topic:'u3.t02',slug:'advantages-javabeans',title:'Advantages of Java Beans',marks:'[3]',
 link:'We know what a bean is.',nextWhy:'How do tools find a bean’s properties? Introspection.',
 ...flow([
  ['♻️','Reusable','Reusable','Write once, use in many apps and GUI builder tools.','pop'],
  ['🔒','Encapsulation','Encapsulation','Data hidden behind getters/setters.','tick'],
  ['💾','Persistence','Persistence','Serializable: save state and load later.','tick'],
  ['📣','Events','Events','Can send and receive events (listeners).','whoosh'],
  ['🧰','Tools','Tool support','IDEs can see and set properties visually (introspection).','ding'],
  ['🌍','Portable','Platform independent','Pure Java: write once, run anywhere.','pop']]),
 mn:[mn('Topic trick','Beans Make Building Easy',''),mn('Points trick (6 advantages)','Real Easy Pets Eat Tasty Pies','Reusable · Encapsulation · Persistence · Events · Tool support · Portable')],
 ans:A({d:'<b>JavaBeans</b> are reusable Java classes with a no-argument constructor, private variables, public getter/setter methods and Serializable support.',
  pt:'Advantages of JavaBeans',p:['Easy to <b>reuse</b> in different apps and GUI tools.','Hides internal data using getters and setters (<b>encapsulation</b>).','Supports saving/sending object state via <b>Serializable</b> (persistence).','Supports <b>event</b> listening out of the box.','<b>Builder tools</b> can inspect and customize them (introspection, customizers).','<b>Platform independent</b> (pure Java).']}),
 q:['Which advantage lets a bean save its state?',['Events','Persistence (Serializable)','Introspection'],1,'Real Easy Pets: P = Persistence.']});
// t03 Introspection
card({topic:'u3.t03',slug:'introspection',title:'Introspection',marks:'[5]',
 link:'Beans are great for tools. But how does a tool know what is inside?',nextWhy:'Introspection works by naming patterns. Next: those patterns.',
 actors:actors(`
tool|🧑‍🔬|Builder tool|12|55
xr|🩻|Introspector|45|55
bean|🫘|Student bean|80|55
p|🏷️|name, age|80|25|h
m|⚙️|methods|62|82|h
e|📣|events|92|82|h`),
 scenes:[S('A tool gets an unknown bean','It wants to show its properties in a panel.','tool bean','pop'),
  S('It uses the Introspector 🩻','Like an X-ray for classes. Class: java.beans.Introspector.','tool xr bean','whoosh','xr'),
  S('Finds properties 🏷️','Sees getName/setName → property "name".','tool xr bean p','ding','p'),
  S('Finds methods and events ⚙️📣','Public methods; addXListener/removeXListener → events.','tool xr bean p m e','ding','e'),
  S('Two ways to know','1) Naming patterns (reflection). 2) A BeanInfo class written by the developer.','tool xr bean','tick','xr')],
 mn:[mn('Topic trick','Introspection = X-ray','Look inside a bean at run time'),mn('Points trick (what it finds)','Please Meet Everyone','Properties · Methods · Events'),mn('How it finds','Names or BeanInfo','Design patterns (reflection) or explicit BeanInfo')],
 code:T('Program: list properties of a bean',`
public class IntroDemo {
    public static void main(String[] args) throws Exception {
        BeanInfo info = Introspector.getBeanInfo(Student.class, Object.class);
        for (PropertyDescriptor pd : info.getPropertyDescriptors()) {
            System.out.println(pd.getName());
        }
    }
}
class Student {
    private String name; private int age;
    public String getName() { return name; }
    public void setName(String n) { name = n; }
    public int getAge() { return age; }
    public void setAge(int a) { age = a; }
}`,[
  ['Introspector.getBeanInfo','Ask the Introspector to X-ray Student (stop at Object).','whoosh',{mem:['info = BeanInfo(Student)']}],
  ['getPropertyDescriptors','Get one PropertyDescriptor per property it found.','pop',{mem:['found: age, name']}],
  ['println','Print each property name.','ding',{con:'age  name'}],
  ['public String getName','It found "name" because of getName/setName (naming pattern).','tick']],'(imports java.beans.*)'),
 ans:A({d:'<b>Introspection</b> is the process by which a builder tool finds out a bean’s <b>properties, methods and events</b> at run time.',
  p:['Done by the class <b>java.beans.Introspector</b>.','Uses <b>naming patterns</b> (getX/setX, addXListener) via reflection.','Or uses an explicit <b>BeanInfo</b> class if the developer provides one.','Result is a BeanInfo object with PropertyDescriptor, MethodDescriptor, EventSetDescriptor.'],
  fig:'Builder tool → Introspector.getBeanInfo(Bean.class) → BeanInfo → properties / methods / events'}),
 q:['Which class performs introspection?',['Reflector','Introspector','BeanMaker'],1,'Introspection = X-ray.']});
// t04 Design patterns
card({topic:'u3.t04',slug:'design-patterns',title:'Properties, Events, and Methods Design Patterns',marks:'[5]',
 link:'Introspection reads names. Here are the naming rules.',nextWhy:'If names are not enough, write a BeanInfo.',
 ...flow([
  ['🏷️','Simple','Simple property','public T getX() / public void setX(T v)','tick'],
  ['✅','Boolean','Boolean property','public boolean isX() (or getX)','tick'],
  ['🔢','Indexed','Indexed property','T getX(int i), void setX(int i, T v), plus T[] getX()','pop'],
  ['📣','Events','Event pattern','addXListener(XListener l) / removeXListener(XListener l)','whoosh'],
  ['⚙️','Methods','Methods','Any other public method is exposed as a method.','ding']]),
 mn:[mn('Topic trick (property methods)','Get Set Is','getX · setX · isX (boolean)'),mn('Points trick (event methods)','Add Remove','addXListener · removeXListener'),mn('Property kinds','Simple Indexed Bound Constrained','"Sister In Big City"')],
 ans:A({d:'<b>Design patterns</b> are naming rules for methods. Introspection uses them to find a bean’s properties, events and methods automatically.',
  tbl:{h:['Feature','Pattern','Example'],r:[['Simple property','T getX(); void setX(T)','getName(), setName(String)'],['Boolean property','boolean isX(); void setX(boolean)','isActive()'],['Indexed property','T getX(int); void setX(int, T)','getMark(int i)'],['Event','addXListener(); removeXListener()','addActionListener()'],['Method','any public method','calculate()']]}}),
 q:['What is the getter name for boolean property "active"?',['getActiveBool()','isActive()','activeGet()'],1,'Get Set Is.']});
// t05 BeanInfo
card({topic:'u3.t05',slug:'beaninfo',title:'Using BeanInfo Interface',marks:'[5]',
 link:'Naming patterns are automatic. BeanInfo lets you control what tools see.',nextWhy:'Some properties notify others: bound and constrained.',
 ...flow([
  ['📝','BeanInfo','Write StudentBeanInfo','Class name = bean name + "BeanInfo". Same package.','pop'],
  ['🧩','Simple','extends SimpleBeanInfo','A ready class with default (null) answers; override only what you need.','tick'],
  ['🏷️','Properties','getPropertyDescriptors()','Show only the properties you choose (hide others).','click'],
  ['⚙️','Methods/Events','getMethodDescriptors(), getEventSetDescriptors()','Control methods and events too.','tick'],
  ['🖼️','Icon','getIcon(), getBeanDescriptor()','Icon for the tool palette; customizer link.','ding']]),
 mn:[mn('Topic trick','BeanInfo = Bean’s ID card',''),mn('Points trick (methods)','Please Meet Every Bean In','getPropertyDescriptors · getMethodDescriptors · getEventSetDescriptors · getBeanDescriptor · getIcon')],
 code:T('Program: BeanInfo shows only "name"',`
public class StudentBeanInfo extends SimpleBeanInfo {
    public PropertyDescriptor[] getPropertyDescriptors() {
        try {
            PropertyDescriptor name = new PropertyDescriptor("name", Student.class);
            return new PropertyDescriptor[] { name };
        } catch (IntrospectionException e) {
            return null;
        }
    }
}
class Student {
    private String name; private int age;
    public String getName() { return name; }
    public void setName(String n) { name = n; }
    public int getAge() { return age; }
    public void setAge(int a) { age = a; }
}`,[
  ['public class StudentBeanInfo','Name = Student + BeanInfo, so Introspector finds it automatically.','pop',{mem:[]}],
  ['extends SimpleBeanInfo','Start from SimpleBeanInfo (defaults).','tick'],
  ['getPropertyDescriptors','Override: we decide the property list.','click'],
  ['new PropertyDescriptor("name"','Describe only "name".','tick',{mem:['visible: name','hidden: age']}],
  ['return new PropertyDescriptor','Tools now show ONLY "name", even though age has get/set.','ding']],'(imports java.beans.*)'),
 ans:A({d:'The <b>BeanInfo</b> interface (java.beans) lets a developer <b>explicitly</b> describe a bean’s properties, methods, events, icon and customizer, instead of relying only on naming patterns.',
  p:['BeanInfo class name = <b>BeanName + "BeanInfo"</b> (e.g. StudentBeanInfo).','Usually <b>extends SimpleBeanInfo</b> and overrides only needed methods.','Methods: <code>getPropertyDescriptors()</code>, <code>getMethodDescriptors()</code>, <code>getEventSetDescriptors()</code>, <code>getBeanDescriptor()</code>, <code>getIcon()</code>.','Used to hide properties, give display names, set icons and customizers.']}),
 q:['What should the BeanInfo class for bean "Car" be named?',['CarInfo','CarBeanInfo','BeanInfoCar'],1,'Name + BeanInfo.']});
// t06 Bound & constrained
card({topic:'u3.t06',slug:'bound-constrained',title:'Bound and Constrained Properties',marks:'[2+3]',
 link:'Beans have properties. Some of them tell others when they change.',nextWhy:'How a bean’s state is saved: persistence.',
 actors:actors(`
b|🫘|Bean (salary)|15|55
bl|📢|PropertyChangeListener|70|30
vl|🛑|VetoableChangeListener|70|78
ok|✅|changed|90|30|h
no|❌|veto!|90|78|h`),
 scenes:[S('A bean property changes','salary: 1000 → 2000','b bl vl','pop','b'),
  S('BOUND: tell others AFTER 📢','Fires PropertyChangeEvent to PropertyChangeListener after the value changes.','b bl ok','whoosh','bl',{bl:'propertyChange()'}),
  S('Bound listeners cannot stop it','They only get the news.','b bl ok','ding','ok'),
  S('CONSTRAINED: ask BEFORE 🛑','Fires to VetoableChangeListener before the value is final.','b vl','whoosh','vl',{vl:'vetoableChange()'}),
  S('Listener can say NO ❌','Throws PropertyVetoException → value is not changed.','b vl no','err','no')],
 mn:[mn('Topic trick','Bound = Behind, Constrained = Can stop','Bound tells after; Constrained asks before and can veto'),mn('Points trick (listeners)','Please Change / Very Careful','PropertyChangeListener (bound) · VetoableChangeListener (constrained)'),mn('Exception trick','Veto Throws PVE','PropertyVetoException')],
 code:T('Program: bound property with PropertyChangeSupport',`
public class Employee {
    private int salary;
    private PropertyChangeSupport pcs = new PropertyChangeSupport(this);
    public void addPropertyChangeListener(PropertyChangeListener l) {
        pcs.addPropertyChangeListener(l);
    }
    public void setSalary(int newSalary) {
        int old = salary;
        salary = newSalary;
        pcs.firePropertyChange("salary", old, newSalary);
    }
    public int getSalary() { return salary; }
}`,[
  ['PropertyChangeSupport','A helper that keeps the listener list and fires events.','pop',{mem:['salary = 1000','pcs (listener list)']}],
  ['addPropertyChangeListener','Other objects register to hear about changes.','click',{mem:['salary = 1000','listeners: 1']}],
  ['public void setSalary','Someone calls setSalary(2000).','tick',{user:'💰 setSalary(2000)'}],
  ['salary = newSalary','Value changes FIRST…','tick',{mem:['old = 1000','salary = 2000']}],
  ['firePropertyChange','…THEN listeners are told (bound = after).','ding',{con:'propertyChange: salary 1000 → 2000'}]],'(imports java.beans.*)'),
 ans:A({d:'<b>Bound</b> and <b>constrained</b> properties are bean properties that notify other objects when their value changes.',
  tbl:{h:['Point','Bound Property','Constrained Property'],r:[['Listener interface','PropertyChangeListener','VetoableChangeListener'],['Event class','PropertyChangeEvent','PropertyChangeEvent with veto check'],['Timing','After the value changes','Before the change is finalized'],['Rejecting changes','Cannot stop a change','Can reject by throwing PropertyVetoException'],['Main purpose','Notify that a value changed','Validate or restrict a value']]},
  x:[['Helper classes','<code>PropertyChangeSupport</code> (firePropertyChange) and <code>VetoableChangeSupport</code> (fireVetoableChange).']]}),
 q:['Which property can reject a change?',['Bound','Constrained','Indexed'],1,'Constrained = Can stop.']});
// t07 Persistence
card({topic:'u3.t07',slug:'persistence',title:'Persistence',marks:'[2.5]',
 link:'Beans hold state. Can we save it and load it later?',nextWhy:'Builder tools can also edit beans with a customizer.',
 ...flow([
  ['🫘','Bean','A bean with data','name = "Samrat", age = 21','pop'],
  ['📦','Serializable','Way 1: Serialization','ObjectOutputStream writes bytes to a file.','whoosh'],
  ['📄','XMLEncoder','Way 2: XMLEncoder','Writes a readable XML file. Best for long-term storage of beans.','whoosh'],
  ['🙈','transient','transient fields are skipped','e.g. a password or open connection.','tick'],
  ['📥','Load','Load it back','ObjectInputStream.readObject() / XMLDecoder.readObject().','ding']]),
 mn:[mn('Topic trick','Persistence = Pause and Resume','save state, load later'),mn('Points trick (3 points)','Sweet Xmas Treats','Serializable · XMLEncoder/XMLDecoder · transient fields not saved')],
 code:T('Program: save a bean as XML',`
public class SaveBean {
    public static void main(String[] args) throws Exception {
        Student s = new Student();
        s.setName("Samrat");
        XMLEncoder enc = new XMLEncoder(new FileOutputStream("student.xml"));
        enc.writeObject(s);
        enc.close();
    }
}
${BEAN.replace('public class Student','class Student')}`,[
  ['new Student()','Make a bean with the no-arg constructor.','pop',{mem:['s = Student']}],
  ['s.setName','Set its property.','tick',{mem:['s.name = Samrat']}],
  ['new XMLEncoder','Open an XML encoder to a file.','tick'],
  ['enc.writeObject','Writes the bean’s properties as XML.','whoosh',{con:'student.xml: <string>Samrat</string> …'}],
  ['enc.close','Save and close.','ding']],'(imports java.beans.*, java.io.*)'),
 ans:A({d:'<b>Persistence</b> is the ability of a bean to save its state (property values) and restore it later.',
  p:['By <b>Serialization</b>: bean implements Serializable; save with ObjectOutputStream, load with ObjectInputStream.','By <b>XMLEncoder / XMLDecoder</b>: saves bean properties as XML (long-term persistence).','<b>transient</b> fields are not saved.','Builder tools use persistence to store a designed GUI.']}),
 q:['Which keyword stops a field from being saved?',['static','transient','private'],1,'Sweet Xmas Treats: T = transient.']});
// t08 Customizers
card({topic:'u3.t08',slug:'customizers',title:'Customizers',marks:'[2.5]',
 link:'Builder tools edit bean properties. Sometimes a simple property sheet is not enough.',nextWhy:'All these classes belong to the JavaBeans API.',
 ...flow([
  ['🧑‍🔧','Tool','Builder tool','Normally shows a plain property sheet.','pop'],
  ['🪄','Customizer','Customizer = a wizard','A GUI panel made by the bean author to set up the bean step by step.','whoosh'],
  ['🧩','Interface','implements Customizer','Usually extends JPanel. Must have a no-arg constructor.','tick'],
  ['🎯','setObject','setObject(bean)','Tool gives the bean to the customizer to edit.','click'],
  ['🔗','BeanDescriptor','Linked via BeanInfo','getBeanDescriptor() returns new BeanDescriptor(Bean.class, MyCustomizer.class).','ding']]),
 mn:[mn('Topic trick','Customizer = Wizard dressing the bean',''),mn('Points trick (3 points)','Penguins Sell Bananas','Panel (extends Component) · setObject(bean) · BeanDescriptor links it')],
 ans:A({d:'A <b>Customizer</b> is a GUI class that gives a full, user-friendly editor (wizard) for a bean inside a builder tool, instead of the simple property sheet.',
  p:['Implements <b>java.beans.Customizer</b> and extends <b>Component</b> (usually JPanel).','Must have a public no-arg constructor.','Methods: <code>setObject(Object bean)</code>, <code>addPropertyChangeListener()</code>, <code>removePropertyChangeListener()</code>.','Registered in BeanInfo: <code>new BeanDescriptor(beanClass, customizerClass)</code>.','Property editors edit ONE property; a customizer edits the WHOLE bean.']}),
 q:['Which method gives the bean to a customizer?',['setBean()','setObject()','getCustomizer()'],1,'Penguins Sell Bananas: S = setObject.']});
// t09 JavaBeans API
card({topic:'u3.t09',slug:'javabeans-api',title:'The Java Beans API',marks:'[5]',
 link:'We used many bean classes. They all live in java.beans.',nextWhy:'Now put it all together and write a bean.',
 ...flow([
  ['🩻','Introspector','Introspector, BeanInfo, SimpleBeanInfo','Find what is inside a bean.','pop'],
  ['🏷️','Descriptors','PropertyDescriptor, MethodDescriptor, EventSetDescriptor, BeanDescriptor','Describe each feature.','tick'],
  ['📢','Change','PropertyChangeListener / Event / Support','Bound properties.','whoosh'],
  ['🛑','Veto','VetoableChangeListener, PropertyVetoException','Constrained properties.','err'],
  ['🎛️','Editors','PropertyEditor, Customizer','Edit beans in tools.','tick'],
  ['💾','XML','XMLEncoder, XMLDecoder, Beans','Persistence and creating beans.','ding']]),
 mn:[mn('Topic trick','java.beans = Bean toolbox',''),mn('Points trick (groups)','In Dark Places Very Easy Xylophones','Introspection · Descriptors · PropertyChange · Veto · Editors/Customizer · XML')],
 ans:A({d:'The <b>JavaBeans API</b> is the set of classes and interfaces in the <b>java.beans</b> package used to create, inspect and manage beans.',
  tbl:{h:['Class / Interface','Use'],r:[['Introspector','Analyses a bean'],['BeanInfo / SimpleBeanInfo','Explicit bean information'],['PropertyDescriptor','Describes a property'],['EventSetDescriptor, MethodDescriptor','Describe events, methods'],['PropertyChangeListener / Event / Support','Bound properties'],['VetoableChangeListener, PropertyVetoException','Constrained properties'],['PropertyEditor, Customizer','Editing in builder tools'],['XMLEncoder, XMLDecoder','Persistence as XML'],['Beans','Utility, e.g. Beans.instantiate()']]}}),
 q:['Which package holds the JavaBeans API?',['java.bean','java.beans','javax.beans'],1,'java.beans = Bean toolbox.']});
// t10 Writing JavaBeans
card({topic:'u3.t10',slug:'writing-javabeans',title:'Writing JavaBeans',marks:'[5]',
 link:'We know all the parts. Now write and use a complete bean.',nextWhy:'Unit 4: Servlets and JSP (server-side Java).',
 ...flow([
  ['📄','Class','1. public class … implements Serializable','','pop'],
  ['🚪','Constructor','2. public no-arg constructor','','tick'],
  ['🔒','Fields','3. private fields','','tick'],
  ['🔑','Get/Set','4. getters and setters','(+ events / bound properties if needed)','click'],
  ['🫙','JAR','5. Compile and package in a JAR','Manifest: Java-Bean: True. Load into a builder tool or use in code.','ding']]),
 mn:[mn('Topic trick (5 steps)','Cool Cats Find Good Jam','Class · Constructor · Fields · Get/Set · JAR')],
 code:T('Program: write and use a bean',`
public class BeanTest {
    public static void main(String[] args) {
        Student s = new Student();
        s.setName("Samrat");
        s.setAge(21);
        System.out.println(s.getName() + " is " + s.getAge());
    }
}
${BEAN.replace('public class Student','class Student')}`,[
  ['class Student','The bean: Serializable, no-arg constructor, private fields, get/set.','pop',{mem:[]}],
  ['new Student()','Create the bean with the no-arg constructor.','pop',{mem:['s = Student (name=null, age=0)']}],
  ['s.setName||s.setAge','Set properties only through setters.','tick',{mem:['s.name = Samrat','s.age = 21']}],
  ['println','Read with getters.','ding',{con:'Samrat is 21'}]]),
 ans:A({d:'<b>Writing a JavaBean</b> means creating a reusable class that follows bean rules so tools and programs can use it.',
  pt:'Steps',p:['Create a <b>public class</b> that implements <b>Serializable</b>.','Add a <b>public no-arg constructor</b>.','Make fields <b>private</b>.','Add <b>getters/setters</b> (and events/bound properties if needed).','Compile and package into a <b>JAR</b> with manifest entry <code>Java-Bean: True</code>.'],code:BEAN.trim()}),
 q:['What is step 5 of writing a bean?',['Add private fields','Package into a JAR','Add a constructor'],1,'Cool Cats Find Good Jam.']});
console.log('unit3 written');
