import {mn,actors,S,flow,W,T,A,writer} from '../../../tools/author.mjs';
const card=writer('advanced-java');

// t01 Introducing Swing
card({topic:'u1.t01',slug:'introducing-swing',title:'Introducing Swing',marks:'[5]',
 link:'First topic of GUI Programming.',nextWhy:'Every Swing app needs a window first.',
 ...flow([
  ['🏚️','AWT','Old way: AWT','AWT asks the operating system to draw buttons. It is heavy and looks different on each OS.','pop'],
  ['🪶','Swing','New way: Swing','Swing draws its own buttons in pure Java. It is light and looks the same everywhere.','whoosh','I am light!'],
  ['🎨','Look & Feel','Pluggable look and feel','You can change the whole style (Metal, Nimbus, Windows) with one line.','ding'],
  ['🧱','J-components','Names start with J','JButton, JLabel, JTextField, JFrame… all in javax.swing.','pop'],
  ['🧠','MVC','Built on MVC idea','Data (model) is kept apart from the view, so components are flexible.','tick']],
  ['Swing = light, pretty, flexible','AWT is heavy (uses OS), Swing is light (pure Java).']),
 mn:[mn('Topic trick','AWT Heavy, Swing Light','AWT uses OS parts, Swing is pure Java'),mn('Points trick (4 features)','Little Pigs Make Jam','Lightweight · Pluggable look · MVC based · J-prefix names')],
 code:T('Program: first Swing window',`
import javax.swing.*;
public class SwingDemo {
    public static void main(String[] args) {
        JFrame f = new JFrame("Swing Demo");
        JButton b = new JButton("Hello Swing");
        f.add(b);
        f.setSize(250, 120);
        f.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        f.setVisible(true);
    }
}`,[
  ['import javax.swing','All Swing classes live in the package javax.swing.','tick',{win:W('',0),mem:[]}],
  ['main(','Program starts at main().'],
  ['new JFrame','A JFrame (the window) is made in memory.','pop',{mem:['f = JFrame "Swing Demo"']}],
  ['new JButton','A JButton is made. Note the J at the start: it is a Swing component.','pop',{mem:['f = JFrame "Swing Demo"','b = JButton "Hello Swing"']}],
  ['f.add(b)','The button is put inside the window.','tick',{win:W('Swing Demo',0,'b:Hello Swing')}],
  ['setVisible','Size is set and the window appears.','ding',{win:W('Swing Demo',1,'b:Hello Swing')}]],'(complete program)'),
 ans:A({d:'<b>Swing</b> is a Java GUI toolkit (package <code>javax.swing</code>) used to build windows, buttons, text boxes and other graphical parts. It is built on top of AWT and is written fully in Java.',
  pt:'Features of Swing',p:['<b>Lightweight</b>: components are drawn by Java, not by the operating system.','<b>Pluggable look and feel</b>: the style can be changed at run time.','<b>MVC based</b>: data (model) is separate from display (view).','<b>Platform independent</b>: looks the same on all OS.','<b>Rich components</b>: JTable, JTree, JTabbedPane, etc. (names start with J).'],
  tbl:{h:['AWT','Swing'],r:[['Heavyweight (uses OS peers)','Lightweight (pure Java)'],['Look depends on OS','Same look on every OS, can change'],['Package java.awt','Package javax.swing'],['Fewer components','Many rich components'],['Button, Label','JButton, JLabel']]},
  fig:'Object → Component → Container → JComponent → JButton, JLabel, JPanel …',figT:'Figure (class hierarchy)'}),
 q:['Why is Swing called lightweight?',['It uses less RAM','Its components are drawn by Java, not the OS','It has fewer classes'],1,'AWT Heavy, Swing Light.']});

// t03 Displaying information in a component
card({topic:'u1.t03',slug:'displaying-information',title:'Displaying Information in a Component',marks:'[5]',
 link:'We have a window. Now we write or draw inside it.',nextWhy:'After text, we draw shapes.',
 ...flow([
  ['🖼️','JPanel','Take a blank board','We draw on a JPanel (or JComponent), not on the frame directly.','pop'],
  ['🖌️','paintComponent','Java calls paintComponent(g)','Java calls it by itself whenever the window must be drawn (open, resize, un-hide).','whoosh','paintComponent(g)'],
  ['🧽','super','Clean first: super.paintComponent(g)','Clears the old drawing so it does not leave marks.','tick'],
  ['✍️','drawString','Write: g.drawString("Hi", x, y)','The Graphics object g is the pen. x, y = position in pixels.','ding','Hi!'],
  ['🔁','repaint()','Need to change it? call repaint()','Never call paintComponent yourself. Ask Java with repaint().','click']]),
 mn:[mn('Topic trick','Paint Pen Position','paintComponent · Graphics pen · x,y position'),mn('Points trick (3 rules)','Sad Dogs Run','Super first · Draw with g · Repaint to update')],
 code:T('Program: write text in a panel',`
class MessagePanel extends JPanel {
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        g.drawString("Hello, Swing!", 75, 100);
    }
}
public class DrawText {
    public static void main(String[] args) {
        JFrame f = new JFrame("Text");
        f.add(new MessagePanel());
        f.setSize(300, 200);
        f.setVisible(true);
    }
}`,[
  ['main(','Program starts at main() and makes a frame.','tick',{win:W('',0),mem:[]}],
  ['f.add(new MessagePanel())','Our own panel (a JPanel child) is added into the frame.','pop',{mem:['panel = MessagePanel']}],
  ['setVisible','Window shows. Java now needs to draw the panel…','tick',{win:W('Text',1)}],
  ['protected void paintComponent','…so Java calls paintComponent(g) BY ITSELF. g = the pen.','whoosh',{user:'🪟 The window opens',mem:['panel = MessagePanel','g = Graphics (pen)']}],
  ['super.paintComponent','First clear the background.','tick'],
  ['g.drawString','Write the text at x=75, y=100.','ding',{win:W('Text',1,'l:Hello, Swing!')}]],'(imports java.awt.*, javax.swing.* skipped)'),
 ans:A({d:'To display information in a component, we make a class that extends <b>JPanel</b> (or JComponent) and override <b>paintComponent(Graphics g)</b>. Java calls this method automatically whenever the component needs to be drawn.',
  p:['<b>paintComponent(Graphics g)</b> is called by Java, not by us.','Call <b>super.paintComponent(g)</b> first to clear the background.','The <b>Graphics</b> object is the pen: <code>drawString()</code>, <code>drawLine()</code>, <code>drawRect()</code>.','Coordinates are in pixels; (0,0) is the top-left corner.','To redraw, call <b>repaint()</b>.'],
  fig:'Window opens/resizes → Java → paintComponent(g) → g.drawString("Hello", x, y) → text on screen'}),
 q:['How should you redraw a component when data changes?',['Call paintComponent() yourself','Call repaint()','Create a new frame'],1,'Sad Dogs Run: … Repaint.']});

// t04 2D shapes
card({topic:'u1.t04',slug:'2d-shapes',title:'Working with 2D Shapes',marks:'[5]',
 link:'We can write text. Now we draw shapes.',nextWhy:'Shapes look better with color.',
 ...flow([
  ['🖌️','Graphics','Old pen: Graphics','Graphics can only do simple lines and boxes.','pop'],
  ['🖋️','Graphics2D','Better pen: Graphics2D','Cast it: Graphics2D g2 = (Graphics2D) g;','whoosh','(Graphics2D) g'],
  ['📏','Line2D','Line2D.Double','A straight line from (x1,y1) to (x2,y2).','tick'],
  ['⬛','Rectangle2D','Rectangle2D.Double','A box: x, y, width, height.','tick'],
  ['⚪','Ellipse2D','Ellipse2D.Double','Oval inside a bounding box. Same width and height = circle.','tick'],
  ['🎯','draw / fill','g2.draw(shape) or g2.fill(shape)','draw = outline only. fill = paint inside.','ding']]),
 mn:[mn('Topic trick (shapes)','Lazy Rabbits Eat','Line2D · Rectangle2D · Ellipse2D (java.awt.geom)'),mn('Points trick (3 steps)','Cats Catch Dogs','Cast g to Graphics2D · Create shape object · Draw or fill it')],
 code:T('Program: draw a rectangle, ellipse and line',`
class ShapePanel extends JPanel {
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2 = (Graphics2D) g;
        Rectangle2D rect = new Rectangle2D.Double(50, 40, 150, 80);
        g2.draw(rect);
        Ellipse2D oval = new Ellipse2D.Double(50, 40, 150, 80);
        g2.draw(oval);
        g2.draw(new Line2D.Double(50, 40, 200, 120));
    }
}`,[
  ['protected void paintComponent','Java calls paintComponent(g) when the panel must be drawn.','whoosh',{win:W('Shapes',1),mem:['g = Graphics']}],
  ['Graphics2D g2','Cast the pen to Graphics2D to get the better tools.','tick',{mem:['g2 = Graphics2D (better pen)']}],
  ['new Rectangle2D','Create a rectangle object: x=50, y=40, width=150, height=80. Not drawn yet!','pop',{mem:['g2 = Graphics2D','rect = 150×80 at (50,40)']}],
  ['g2.draw(rect)','Now it is drawn (outline).','ding',{win:W('Shapes',1,'l:▭ rectangle')}],
  ['new Ellipse2D','An ellipse in the same box (fits inside the rectangle).','pop',{mem:['g2 = Graphics2D','rect','oval = inside same box']}],
  ['g2.draw(oval)','Ellipse drawn.','ding',{win:W('Shapes',1,'l:▭ rectangle','l:⬭ ellipse')}],
  ['new Line2D','A diagonal line from corner to corner.','ding',{win:W('Shapes',1,'l:▭ rectangle','l:⬭ ellipse','l:╲ line')}]],'(imports java.awt.*, java.awt.geom.*, javax.swing.* skipped)'),
 ans:A({d:'<b>Java 2D</b> lets us draw shapes using the <b>Graphics2D</b> class and shape classes from <code>java.awt.geom</code>, like <b>Line2D</b>, <b>Rectangle2D</b> and <b>Ellipse2D</b>.',
  p:['Cast <code>Graphics</code> to <b>Graphics2D</b>.','Create a shape object, e.g. <code>new Rectangle2D.Double(x, y, w, h)</code>.','Use <b>draw(shape)</b> for outline and <b>fill(shape)</b> to fill it.','Shape classes have <b>.Double</b> and <b>.Float</b> versions.'],
  tbl:{h:['Shape class','Made with'],r:[['Line2D','(x1, y1, x2, y2)'],['Rectangle2D','(x, y, width, height)'],['Ellipse2D','bounding box (x, y, width, height)']]}}),
 q:['Which method fills the inside of a shape?',['g2.draw()','g2.fill()','g2.paint()'],1,'draw = outline, fill = inside.']});

// t05 Color
card({topic:'u1.t05',slug:'using-color',title:'Using Color',marks:'[2.5]',
 link:'We can draw shapes. Now we color them.',nextWhy:'Text can also get special fonts.',
 ...flow([
  ['🎨','Color','The Color class','In java.awt. Every color is a mix of Red, Green, Blue.','pop'],
  ['🔴','RGB','new Color(r, g, b)','Each value 0 to 255. new Color(255,0,0) = red.','tick'],
  ['🏷️','Constants','Ready colors','Color.RED, Color.BLUE, Color.GREEN, Color.BLACK …','tick'],
  ['🖌️','setPaint','g2.setPaint(Color.RED)','Pick the paint first…','click'],
  ['🟥','fill','g2.fill(rect)','…then draw or fill. The shape is red.','ding'],
  ['🪟','background','setBackground / setForeground','Change color of a whole component.','tick']]),
 mn:[mn('Topic trick','Really Good Bananas','Red · Green · Blue, each 0–255'),mn('Points trick (order)','Pick Then Paint','setPaint/setColor first, then draw/fill')],
 code:T('Program: red filled rectangle',`
protected void paintComponent(Graphics g) {
    super.paintComponent(g);
    Graphics2D g2 = (Graphics2D) g;
    g2.setPaint(Color.RED);
    g2.fill(new Rectangle2D.Double(40, 40, 120, 60));
    g2.setPaint(new Color(0, 128, 255));
    g2.drawString("Blue text", 40, 140);
}`,[
  ['protected void','Java calls paintComponent when drawing.','whoosh',{win:W('Color',1),mem:[]}],
  ['Color.RED','Pick red paint (a ready constant).','click',{mem:['paint = RED (255,0,0)']}],
  ['g2.fill','Fill a rectangle: it comes out red.','ding',{win:W('Color',1,'l:🟥 red box')}],
  ['new Color(0, 128, 255)','Make our own color: R=0, G=128, B=255 → sky blue.','click',{mem:['paint = (0,128,255) blue']}],
  ['drawString','Text is drawn in blue.','ding',{win:W('Color',1,'l:🟥 red box','l:Blue text')}]],'(inside a JPanel subclass)'),
 ans:A({d:'The <b>Color</b> class (in <code>java.awt</code>) represents colors using <b>RGB</b> values (Red, Green, Blue), each from 0 to 255.',
  p:['Make a color: <code>new Color(r, g, b)</code>.','Use constants: <code>Color.RED</code>, <code>Color.BLUE</code>, etc.','Set drawing color: <code>g2.setPaint(c)</code> or <code>g.setColor(c)</code>, then draw/fill.','Component colors: <code>setBackground(c)</code>, <code>setForeground(c)</code>.','<code>brighter()</code> and <code>darker()</code> give lighter/darker shades.']}),
 q:['new Color(0, 0, 255) gives which color?',['Red','Green','Blue'],2,'R, G, B: third value is Blue.']});

// t06 Fonts
card({topic:'u1.t06',slug:'special-fonts',title:'Using Special Fonts for Text',marks:'[2.5]',
 link:'We can color text. Now we change its font.',nextWhy:'After text and shapes, we show pictures.',
 ...flow([
  ['🔤','Font','The Font class','In java.awt. Controls how text looks.','pop'],
  ['🏷️','Name','1. Font name','"Serif", "SansSerif", "Monospaced", "Dialog", "DialogInput" (logical fonts) or a real one like "Arial".','tick'],
  ['🅱️','Style','2. Style','Font.PLAIN, Font.BOLD, Font.ITALIC (or BOLD + ITALIC).','tick'],
  ['📐','Size','3. Size in points','e.g. 24.','tick'],
  ['✍️','setFont','g2.setFont(f) then drawString','The next text uses this font.','ding','Big Bold!']]),
 mn:[mn('Topic trick (constructor)','Nice Soft Sofa','new Font(Name, Style, Size)'),mn('Points trick (styles)','Please Be Interesting','PLAIN · BOLD · ITALIC')],
 code:T('Program: bold serif text',`
protected void paintComponent(Graphics g) {
    super.paintComponent(g);
    Graphics2D g2 = (Graphics2D) g;
    Font f = new Font("Serif", Font.BOLD, 24);
    g2.setFont(f);
    g2.drawString("Exam Hero", 40, 80);
}`,[
  ['protected void','Java calls paintComponent.','whoosh',{win:W('Font',1),mem:[]}],
  ['new Font','Create a font: name Serif, style BOLD, size 24.','pop',{mem:['f = Serif, BOLD, 24']}],
  ['setFont','Tell the pen to use this font.','click'],
  ['drawString','Text drawn big and bold.','ding',{win:W('Font',1,'l:𝐄𝐱𝐚𝐦 𝐇𝐞𝐫𝐨')}]],'(inside a JPanel subclass)'),
 ans:A({d:'The <b>Font</b> class (in <code>java.awt</code>) is used to draw text in a special typeface, style and size.',
  p:['Create: <code>new Font(name, style, size)</code>.','Styles: <b>Font.PLAIN</b>, <b>Font.BOLD</b>, <b>Font.ITALIC</b>.','Logical font names: Serif, SansSerif, Monospaced, Dialog, DialogInput.','Apply: <code>g2.setFont(f)</code> (drawing) or <code>component.setFont(f)</code>.','List installed fonts: <code>GraphicsEnvironment.getLocalGraphicsEnvironment().getAvailableFontFamilyNames()</code>.'],
  code:'Font f = new Font("Serif", Font.BOLD, 24);\ng2.setFont(f);\ng2.drawString("Exam Hero", 40, 80);'}),
 q:['What are the 3 parts of new Font(...)?',['Name, Style, Size','Color, Size, Width','Name, Color, Style'],0,'Nice Soft Sofa.']});

// t07 Images
card({topic:'u1.t07',slug:'displaying-images',title:'Displaying Images',marks:'[2.5]',
 link:'We can draw text and shapes. Now we show pictures.',nextWhy:'Our window looks good. Next: make it react to the user.',
 ...flow([
  ['📁','File','Picture file','JPG, PNG or GIF on disk or from a URL.','pop'],
  ['📥','ImageIO.read','Load it','Image img = ImageIO.read(new File("cat.jpg")); (or new ImageIcon("cat.jpg"))','whoosh'],
  ['🖌️','paintComponent','Java calls paintComponent','Inside it we draw the image.','tick'],
  ['🖼️','drawImage','g.drawImage(img, x, y, null)','The picture appears at x, y.','ding'],
  ['🏷️','JLabel','Easy way','new JLabel(new ImageIcon("cat.jpg")) shows a picture with no drawing code.','pop']]),
 mn:[mn('Topic trick','Load Then Draw','ImageIO.read() → g.drawImage()'),mn('Points trick (formats)','Just Pretty Graphics','JPG · PNG · GIF')],
 code:T('Program: show an image',`
class ImagePanel extends JPanel {
    private Image img;
    ImagePanel() throws IOException {
        img = ImageIO.read(new File("cat.jpg"));
    }
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        g.drawImage(img, 20, 20, null);
    }
}`,[
  ['ImagePanel()','Constructor runs when the panel is made.','tick',{win:W('Image',0),mem:[]}],
  ['ImageIO.read','Load cat.jpg from disk into memory. (May throw IOException.)','whoosh',{mem:['img = cat.jpg (loaded)']}],
  ['protected void paintComponent','Window opens → Java calls paintComponent.','whoosh',{win:W('Image',1)}],
  ['g.drawImage','Draw the picture at x=20, y=20.','ding',{win:W('Image',1,'l:🐱 (cat.jpg)')}]],'(imports java.awt.*, java.io.*, javax.imageio.*, javax.swing.* skipped)'),
 ans:A({d:'Java can display images (JPG, PNG, GIF) by loading them with <b>ImageIO.read()</b> or <b>ImageIcon</b> and drawing them with <b>drawImage()</b>.',
  p:['Load: <code>Image img = ImageIO.read(new File("cat.jpg"));</code>','Draw in paintComponent: <code>g.drawImage(img, x, y, null);</code>','Easy way: <code>new JLabel(new ImageIcon("cat.jpg"))</code>.','Can scale: <code>g.drawImage(img, x, y, width, height, null)</code>.']}),
 q:['Which method draws a picture?',['drawString()','drawImage()','setIcon()'],1,'Load Then Draw.']});

// t08 Event handling basics
card({topic:'u1.t08',slug:'event-handling-basics',title:'Event Handling Basics',marks:'[5]',
 link:'The window looks good, but clicking does nothing yet.',nextWhy:'Each event has its own class (like KeyEvent).',
 ...flow([
  ['🔔','Source','Event Source','The component where something happens (button, text field, window).','pop'],
  ['👆','Event','User acts','Click, key press, mouse move = an event.','click'],
  ['📩','Event object','Event object is made','ActionEvent, KeyEvent, MouseEvent… holds the details.','pop'],
  ['🧑‍🍳','Listener','Sent to the Listener','Only listeners that registered get it (Delegation Event Model).','whoosh','I registered!'],
  ['🍲','Handler','Method runs','e.g. actionPerformed(e). Your code reacts.','ding']],
  ['3 steps to code it: Implement → Register → Override','implements ActionListener · b.addActionListener(this) · write actionPerformed()']),
 mn:[mn('Topic trick (model)','Some Elephants Listen','Source → Event → Listener (Delegation Event Model)'),mn('Points trick (3 coding steps)','Ice Reaches Ocean','Implement interface · Register (addXxxListener) · Override method')],
 code:T('Program: count clicks',`
public class Counter extends JFrame implements ActionListener {
    JButton b = new JButton("Click");
    int count = 0;
    Counter() {
        setLayout(new FlowLayout());
        add(b);
        b.addActionListener(this);
        setSize(200, 100);
        setVisible(true);
    }
    public void actionPerformed(ActionEvent e) {
        count++;
        b.setText("Clicked " + count);
    }
    public static void main(String[] args) { new Counter(); }
}`,[
  ['new Counter()','Start: main() makes the window.','tick',{win:W('',0),mem:[]}],
  ['implements ActionListener','Step 1 IMPLEMENT: we promise to write actionPerformed().','tick',{mem:['Counter is an ActionListener']}],
  ['b.addActionListener(this)','Step 2 REGISTER: button will tell THIS object about clicks.','click',{mem:['b ➜ notifies this','count = 0']}],
  ['setVisible','Window appears.','ding',{win:W('Counter',1,'b:Click')}],
  ['public void actionPerformed','Step 3 OVERRIDE: you click → Java calls this by itself.','click',{user:'👆 You click the button',mem:['e = ActionEvent','count = 0']}],
  ['count++','count becomes 1.','tick',{mem:['count = 1']}],
  ['b.setText','Button text changes.','ding',{win:W('Counter',1,'b:Clicked 1')}]],'(imports java.awt.*, java.awt.event.*, javax.swing.* skipped)'),
 ans:A({d:'<b>Event handling</b> is the way a Java program reacts to user actions like clicks and key presses. Java uses the <b>Delegation Event Model</b>: a source sends an event object to registered listeners.',
  pt:'Parts of the Delegation Event Model',p:['<b>Event Source</b>: component that generates the event (JButton).','<b>Event Object</b>: holds information about the event (ActionEvent).','<b>Event Listener</b>: interface whose method runs when the event occurs (ActionListener).'],
  fig:'[Event Source] --event object--> [Registered Listener] --> handler method runs',
  x:[['Steps to handle an event','<ol><li><b>Implement</b> the listener interface.</li><li><b>Register</b> it: <code>source.addXxxListener(listener)</code>.</li><li><b>Override</b> its method (e.g. <code>actionPerformed</code>).</li></ol>']]}),
 q:['What is step 2 of event handling?',['Override the method','Register the listener with addXxxListener()','Create a frame'],1,'Ice Reaches Ocean: Implement, Register, Override.']});

// t11 Adapter classes
card({topic:'u1.t11',slug:'adapter-classes',title:'Adapter Classes',marks:'[2.5]',
 link:'MouseListener forced us to write 5 methods, 3 of them empty.',nextWhy:'Now we organise Swing code with MVC.',
 ...flow([
  ['😩','Listener','Problem','WindowListener has 7 methods. You need only windowClosing, but must write all 7.','err'],
  ['🧩','Adapter','Adapter class','A ready class that already has ALL methods with empty bodies { }.','pop'],
  ['✂️','Override','Extend it, override one','class MyClose extends WindowAdapter { windowClosing(…) }','click','only 1 method!'],
  ['🧹','Clean','Code is short','No empty methods. Easy to read.','ding']]),
 mn:[mn('Topic trick','Adapters Are Lazy Helpers','They give empty bodies so you write only what you need'),mn('Points trick (3 points)','Big Old Nose','Blank bodies · Override only one · No empty methods to write'),mn('List trick','Many Kids Walk Fast','MouseAdapter · KeyAdapter · WindowAdapter · FocusAdapter (+ MouseMotionAdapter)')],
 code:T('Program: close window with WindowAdapter',`
public class CloseDemo extends Frame {
    CloseDemo() {
        addWindowListener(new WindowAdapter() {
            public void windowClosing(WindowEvent e) {
                System.exit(0);
            }
        });
        setSize(250, 150);
        setVisible(true);
    }
    public static void main(String[] args) { new CloseDemo(); }
}`,[
  ['new CloseDemo()','main() makes an AWT Frame (AWT frames do NOT close on X by themselves).','tick',{win:W('',0),mem:[]}],
  ['new WindowAdapter','Make an object of an anonymous class that extends WindowAdapter. The other 6 methods are already empty.','pop',{mem:['listener = WindowAdapter child']}],
  ['addWindowListener','Register it with the frame.','click',{mem:['frame ➜ notifies listener']}],
  ['setVisible','Window appears.','ding',{win:W('CloseDemo',1)}],
  ['public void windowClosing','You click X → Java calls windowClosing by itself.','click',{user:'❎ You click the X button'}],
  ['System.exit','Program ends.','ding',{win:W('',0)}]],'(imports java.awt.*, java.awt.event.* skipped)'),
 ans:A({d:'An <b>Adapter class</b> gives blank default bodies for all methods of a listener interface that has multiple methods.',
  p:['Examples: <b>MouseAdapter</b>, <b>KeyAdapter</b>, <b>WindowAdapter</b>, FocusAdapter, MouseMotionAdapter.','Avoids writing empty methods you do not need when implementing a listener interface directly.','You override only the method you care about.'],
  tbl:{h:['Listener interface','Adapter class'],r:[['MouseListener (5 methods)','MouseAdapter'],['KeyListener (3)','KeyAdapter'],['WindowListener (7)','WindowAdapter'],['FocusListener (2)','FocusAdapter'],['MouseMotionListener (2)','MouseMotionAdapter']]},
  x:[['Note','ActionListener has only 1 method, so it has no adapter.']]}),
 q:['Why use an adapter class?',['To make the program faster','To avoid writing empty listener methods','To draw shapes'],1,'Big Old Nose: Blank bodies…']});

// t12 MVC
card({topic:'u1.t12',slug:'swing-mvc',title:'Swing and the MVC Design Pattern',marks:'[5]',
 link:'We know components and events. Now: how Swing organises them inside.',nextWhy:'Next: how components are placed (layouts).',
 actors:actors(`
k|🧑‍🍳|Model (kitchen = data)|15|58
v|🍽️|View (plate = display)|50|58
c|🧑‍💼|Controller (waiter = input)|85|58
u|🧑|Customer|85|20|h`),
 scenes:[S('A restaurant = MVC','Swing components are built like a restaurant with 3 jobs.','k v c','pop'),
  S('Model = kitchen 🧑‍🍳','Holds the DATA and state. e.g. is the button pressed? the text in a field.','k v c','tick','k'),
  S('View = plate 🍽️','Shows the data on screen. How it LOOKS.','k v c','tick','v'),
  S('Controller = waiter 🧑‍💼','Takes the user INPUT (mouse/keys) and tells the model.','k v c u','click','c',{u:'One more item!'}),
  S('Model changes → View updates','Data changes in the kitchen, the plate is updated automatically.','k v c u','whoosh','v'),
  S('In Swing: View + Controller joined','Swing uses Model–UI Delegate: view and controller are one "UI delegate". Model stays separate.','k v c','ding','k')],
 mn:[mn('Topic trick','My Village Cafe','Model · View · Controller'),mn('Points trick (jobs)','Data Display Direct','Model = data · View = display · Controller = directs input'),mn('Swing twist','Two Become One','View + Controller = UI delegate')],
 code:T('Program: list model updates the view',`
DefaultListModel<String> model = new DefaultListModel<>();
model.addElement("Java");
JList<String> list = new JList<>(model);
JFrame f = new JFrame("MVC");
f.add(list);
f.setSize(200, 150);
f.setVisible(true);
model.addElement("Swing");`,[
  ['DefaultListModel','MODEL: holds the data (a list of strings).','pop',{win:W('',0),mem:['model = []']}],
  ['model.addElement("Java")','Add data to the model.','tick',{mem:['model = [Java]']}],
  ['new JList','VIEW: JList shows whatever the model holds.','pop',{mem:['model = [Java]','list → views model']}],
  ['setVisible','Window shows the list.','ding',{win:W('MVC',1,'l:• Java')}],
  ['model.addElement("Swing")','Change only the MODEL… the VIEW updates by itself!','ding',{win:W('MVC',1,'l:• Java','l:• Swing'),mem:['model = [Java, Swing]']}]],'(inside main; imports javax.swing.* skipped)'),
 ans:A({d:'<b>MVC (Model–View–Controller)</b> is a design pattern that splits a component into three parts: the <b>Model</b> (data), the <b>View</b> (display) and the <b>Controller</b> (user input).',
  p:['<b>Model</b>: stores data/state (e.g. ButtonModel, ListModel, TableModel).','<b>View</b>: shows the model on screen.','<b>Controller</b>: handles user input and updates the model.','Swing joins View and Controller into a <b>UI delegate</b> (Model–Delegate design).','Advantages: change the look without changing data; same data in many views; easier to maintain.'],
  fig:'User --input--> [Controller] --updates--> [Model] --notifies--> [View] --shows--> User'}),
 q:['In MVC, which part holds the data?',['View','Controller','Model'],2,'Data Display Direct: Model = data.']});

// t13 Layout
card({topic:'u1.t13',slug:'layout-management',title:'Layout Management',marks:'[5]',
 link:'We have many components. Where do they sit in the window?',nextWhy:'Now the actual components to place.',
 ...flow([
  ['➡️','FlowLayout','FlowLayout','Left to right like words in a line; wraps to next line. Default for JPanel.','tick'],
  ['🧭','BorderLayout','BorderLayout','5 areas: NORTH, SOUTH, EAST, WEST, CENTER. Default for JFrame.','pop'],
  ['🔢','GridLayout','GridLayout(rows, cols)','Equal-size boxes in a grid, like a calculator.','tick'],
  ['🃏','CardLayout','CardLayout','Cards on top of each other; one shows at a time.','tick'],
  ['🧱','GridBag/Box','GridBagLayout · BoxLayout','GridBag = flexible grid; Box = one row or one column.','tick'],
  ['🛠️','setLayout','setLayout(new …Layout())','Pick the layout manager for a container.','ding']]),
 mn:[mn('Topic trick (layouts)','Funny Bears Get Cake','FlowLayout · BorderLayout · GridLayout · CardLayout (+ GridBag, Box)'),mn('BorderLayout areas','Never Eat Soggy Waffles','North · East · South · West (+ Center)'),mn('Defaults','Panel Flows, Frame Borders','JPanel = FlowLayout, JFrame = BorderLayout')],
 code:T('Program: BorderLayout with 5 buttons',`
JFrame f = new JFrame("Border");
f.setLayout(new BorderLayout());
f.add(new JButton("North"), BorderLayout.NORTH);
f.add(new JButton("South"), BorderLayout.SOUTH);
f.add(new JButton("East"), BorderLayout.EAST);
f.add(new JButton("West"), BorderLayout.WEST);
f.add(new JButton("Center"), BorderLayout.CENTER);
f.setSize(300, 200);
f.setVisible(true);`,[
  ['new JFrame','Make a window.','tick',{win:W('',0),mem:[]}],
  ['setLayout','Choose BorderLayout: 5 areas.','pop',{mem:['layout = BorderLayout']}],
  ['NORTH','Button goes to the top.','tick'],['SOUTH','Button goes to the bottom.','tick'],
  ['EAST||WEST','Right and left sides.','tick'],
  ['CENTER','Center takes all the space left.','tick'],
  ['setVisible','Window shows: N top, S bottom, E right, W left, C middle.','ding',{win:W('Border',1,'b:North','b:West','b:Center','b:East','b:South')}]],'(inside main; imports java.awt.*, javax.swing.* skipped)'),
 ans:A({d:'A <b>Layout Manager</b> decides the size and position of components inside a container. It is set with <code>setLayout()</code>.',
  tbl:{h:['Layout','How it arranges'],r:[['<b>FlowLayout</b>','Left to right in a row, wraps (default for JPanel)'],['<b>BorderLayout</b>','North, South, East, West, Center (default for JFrame)'],['<b>GridLayout</b>','Rows × columns of equal cells'],['<b>CardLayout</b>','Stack of cards, one visible at a time'],['<b>GridBagLayout</b>','Flexible grid, cells can span rows/cols'],['<b>BoxLayout</b>','Single row or column']]},
  p:['Components resize/move automatically when the window size changes.','<code>setLayout(null)</code> = absolute positioning with setBounds().'],pt:'Points'}),
 q:['Default layout of JFrame?',['FlowLayout','BorderLayout','GridLayout'],1,'Panel Flows, Frame Borders.']});

// t14 Basic Swing components
card({topic:'u1.t14',slug:'basic-swing-components',title:'Basic Swing Components',marks:'[5]',
 link:'We know layouts. Now the common components we place.',nextWhy:'Unit 2: saving data in a database with JDBC.',
 ...flow([
  ['🏷️','JLabel','JLabel','Shows text or an image. User cannot type.','pop'],
  ['🔘','JButton','JButton','Click to do an action (ActionListener).','click'],
  ['⌨️','JTextField','JTextField / JTextArea','One-line / many-line text input. getText(), setText().','key'],
  ['☑️','JCheckBox','JCheckBox','Tick many options (ItemListener).','tick'],
  ['🔘','JRadioButton','JRadioButton + ButtonGroup','Choose only ONE from a group.','tick'],
  ['🔽','JComboBox','JComboBox / JList','Dropdown / list to pick items.','ding']]),
 mn:[mn('Topic trick (7 components)','Lazy Bears Teach Tiny Cats Running Circles','JLabel · JButton · JTextField · JTextArea · JCheckBox · JRadioButton · JComboBox'),mn('Points trick (radio)','One Group One Pick','Put radio buttons in a ButtonGroup so only one is selected')],
 code:T('Program: small form',`
JFrame f = new JFrame("Form");
f.setLayout(new FlowLayout());
JLabel l = new JLabel("Name:");
JTextField t = new JTextField(10);
JCheckBox c = new JCheckBox("BCA");
JButton b = new JButton("Submit");
f.add(l); f.add(t); f.add(c); f.add(b);
f.setSize(300, 120);
f.setVisible(true);`,[
  ['new JFrame','Window with FlowLayout (left to right).','tick',{win:W('',0),mem:[]}],
  ['JLabel l','Label: shows text.','pop',{mem:['l = JLabel']}],
  ['JTextField t','Text box 10 columns wide.','pop',{mem:['l = JLabel','t = JTextField']}],
  ['JCheckBox c','A check box.','pop',{mem:['l, t','c = JCheckBox']}],
  ['JButton b','A button.','pop',{mem:['l, t, c','b = JButton']}],
  ['f.add(l)','All four are added in order.','tick'],
  ['setVisible','The form appears.','ding',{win:W('Form',1,'l:Name:','i:','l:☐ BCA','b:Submit')}]],'(inside main; imports skipped)'),
 ans:A({d:'<b>Swing components</b> are ready-made GUI parts in <code>javax.swing</code> (names start with J) used to build user interfaces.',
  tbl:{h:['Component','Use','Main methods / listener'],r:[['JLabel','Show text/image','setText()'],['JButton','Clickable button','addActionListener()'],['JTextField','One-line input','getText(), setText()'],['JTextArea','Multi-line input','append()'],['JCheckBox','Select many options','isSelected(), ItemListener'],['JRadioButton','Select one (with ButtonGroup)','isSelected()'],['JComboBox','Dropdown list','getSelectedItem()'],['JList','List of items','getSelectedValue()'],['JPasswordField','Hidden text','getPassword()']]}}),
 q:['Which component lets you choose only ONE option from a group?',['JCheckBox','JRadioButton in a ButtonGroup','JTextArea'],1,'One Group One Pick.']});
console.log('unit1 written');
