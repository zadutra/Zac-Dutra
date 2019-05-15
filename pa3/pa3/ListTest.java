/*
Zachary Dutra
zdutra
1581789
pa1
*/ 
class ObjectTestClass {
    int i;
    double d;
    String str;
  
    ObjectTestClass(int i, double d, String str) {
      this.i = i;
      this.d = d;
      this.str = str;
    }
  
    public String toString() {
      return i + "," + d + "," + str;
    }
  
    public boolean equals(Object x) {
      if (this.getClass() != x.getClass()) return false;
      ObjectTestClass obj = (ObjectTestClass) x;
      return (this.i == obj.i && this.d == obj.d && this.str.equals(obj.str));
    }
  }

class ListTest{
    public static void main(String[] args){
        List A = new List();
        A.append(1);
        A.prepend(5);
        A.deleteBack();
        A.append(7);
        A.append(1);
        System.out.println(A.toString());
        System.out.println(!A.toString().trim().equals("5 7 1"));
        A = new List();
        ObjectTestClass obj1 = new ObjectTestClass(1, 4.5, "hello");
        A.append(obj1);
        ObjectTestClass obj2 = new ObjectTestClass(5, 3.14, "how");
        A.prepend(obj2);
        A.deleteBack();
        ObjectTestClass obj3 = new ObjectTestClass(7, 75.5, "are");
        A.append(obj3);
        ObjectTestClass obj4 = new ObjectTestClass(1, 1.43, "you");
        A.append(obj4);
        System.out.println(!A.toString().trim().equals("5,3.14,how 7,75.5,are 1,1.43,you"));;
    }
}