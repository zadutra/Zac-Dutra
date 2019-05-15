/*
Zachary Dutra
zdutra
1581789
pa1
*/
class Node{
    Object x;
    Node next;

    Node(Object x){
        this.x = x;
        this.next = null;
    }

    public String toString(){
        return x.toString();
    }
}

class List{
    Node front;
    Node back;
    Node cursor;
    int size;
    int index;
    List(){ // Creates a new empty list.
         this.front = this.back = this.cursor = null;
         this.size  = 0;
         this.index = -1;
    }       
    // Access functions
    int length(){       // Returns the number of elements in this List.
            return this.size;
        }
    int index(){            // If cursor is defined, returns the index of the cursor element,
            if(this.cursor==null){          // otherwise returns -1.
                    return -1;
            }
            else{
                return this.index;
            }           
        }
    
    Object get(){
        return this.cursor.x;
    }
    Object front(){
            return front.x;
        }           // Returns front element. Pre: length()>0
    Object back(){
            return back.x;
        }           // Returns back element. Pre: length()>0
    
    boolean equals(List L){
            Node temp = this.front;
            Node temp2 = L.front;
            if(this.size!=L.size){
                    return false;
            }
            for(int i = 0; i < size; i++){
                if(temp.x !=temp2.x){
                    return false;
                }
                temp = temp.next;
                temp2 = temp2.next;
            }
            return true;
        }           // Returns true if and only if this List and L are the same
                    // integer sequence. The states of the cursors in the two Lists
                    // are not used in determining equality.
                    // Manipulation procedures
    void clear(){
            this.front = this.back = this.cursor = null;
            this.size = 0;
            this.index = -1;
        }            // Resets this List to its original empty state.
    void moveFront(){
            if(size==0){
                return;
            }
            this.cursor = this.front;
            this.index = 0;
            return;
        }           // If List is non-empty, places the cursor under the front element,
                    // otherwise does nothing.
    void moveBack(){
            if(size==0){
                return;
            }
            this.cursor = this.back;
            this.index = size-1;
            return;
    }               // If List is non-empty, places the cursor under the back element,
                    // otherwise does nothing.
    void movePrev(){
            if(this.cursor == null){
                return;
            }
            else if(this.cursor==this.front){
                this.cursor = null;
                this.index = -1;
                return;
            }
            else{
                Node temp = this.front;
                while(temp.next!=this.cursor){
                    temp = temp.next;
                }
                this.cursor = temp;
                this.index--;
                return;
            }
    }               // If cursor is defined and not at front, moves cursor one step toward
                    // front of this List, if cursor is defined and at front, cursor becomes
                    // undefined, if cursor is undefined does nothing.
    void moveNext(){
            if(this.cursor == this.back){
                this.cursor = null;
                this.index = -1;
                return;
            }
            else if(this.cursor == null){
                return;
            }
            else{
                this.cursor = this.cursor.next;
                this.index++;
                return;
            }
    }               // If cursor is defined and not at back, moves cursor one step toward
                    // back of this List, if cursor is defined and at back, cursor becomes
                    // undefined, if cursor is undefined does nothing.
    void prepend(Object x){
            if(size == 0){
                Node temp = new Node(x);
                this.front = this.back = temp;
                this.size++;
                if(this.index != -1){
                    this.index++;
                }
                return;
            }
            else{
                Node temp = new Node(x);
                temp.next = this.front;
                this.front = temp;
                this.size++;
                if(this.index != -1){
                    this.index++;
                }
                return;
            }
    }                // Insert new element into this List. If List is non-empty,
                     // insertion takes place before front element.
    void append(Object x){
            if(size==0){
                Node temp = new Node(x);
                this.front = this.back = temp;
                this.size++;
                return;
            }
            else{
                Node temp = new Node(x);
                this.back.next = temp;
                this.back = temp;
                this.size++;
                return;
            }

    }                // Insert new element into this List. If List is non-empty,
                    // insertion takes place after back element.
    void insertBefore(Object x){
        if(this.index < 0 || this.size == 0){
            return;
        }
        else if(this.index == 0){
                prepend(x);
                return;
        }
        else{
            Node temp = new Node(x);
            Node temp2 = this.front;
            while(temp2.next!=this.cursor){
                temp2 = temp2.next;
            }
            temp2.next = temp;
            temp.next = this.cursor;
            this.size++;
            if(this.index != -1){
                this.index++;
            }
            return;
        }
    }               // Insert new element before cursor.
                    // Pre: length()>0, index()>=0
    void insertAfter(Object x){
        if(this.index < 0 || this.size == 0){
            return;
        }
        else if(this.index == this.size-1){
            append(x);
            return;
        }
        if(this.size == 1){
            Node temp = new Node(x);
            temp = this.back;
            this.size++;
            return;
        }
        else{
            Node temp = new Node(x);
            temp.next = this.cursor.next;
            this.cursor.next = temp;
            this.size++;
            return;
        }
    }               // Inserts new element after cursor.
                    // Pre: length()>0, index()>=0
    void deleteFront(){
        if(size == 0){
            return;
        }
        this.front = this.front.next;
        this.size--;
        if(this.index != -1){
            this.index--;
        }
        return;
    }               // Deletes the front element. Pre: length()>0
    void deleteBack(){
        if(this.size == 0){
            return;
        }
        if(this.cursor == this.back){
            this.cursor = null;
            this.index = -1;
        }
        if(this.size == 1){
            this.front = this.back = null;
            this.size = 0;
            return;
        }
        if(this.size == 2){
            this.back = this.front;
            this.size--;
            return;
        }
        Node deltemp = this.front;
        while(deltemp.next!=this.back){
            deltemp = deltemp.next;
        }
        deltemp.next = null;
        this.back = deltemp;
        this.size--;
        return;
    }               // Deletes the back element. Pre: length()>0

    void delete(){
        if(this.index < 0 || size == 0){
            return;
        }
        else if(this.cursor == this.front){
            deleteFront();
            return;
        }
        else if(this.cursor == this.back){
            deleteBack();
            return;
        }
        else{
            Node temp = this.front;
            while(temp.next!=this.cursor){
                temp = temp.next;
            }
            temp.next = this.cursor.next;
            this.cursor = this.cursor.next = null;
            this.index = -1;
            size--;
            return;
        }
    }               // Deletes cursor element, making cursor undefined.
                    // Pre: length()>0, index()>=0
                    // Other methods
    void deleteNext(){
        if(size <= 1){
            return;
        }
        else if(size == 2 || this.cursor.next.next == null){
            deleteBack();
            return;
        }
        else if(this.cursor.next == this.back){
            deleteBack();
            return;
        }
        this.cursor.next = this.cursor.next.next;
        size--;
        return;
    }

    public String toString(){
        Node temp = this.front;
        String output_S = "";
        for(int i = 0; i < this.size; i++){
            output_S += temp.x;
            temp = temp.next;
        }
        return output_S;
    }               // Overrides Object's toString method. Returns a String
                    // representation of this List consisting of a space
                    // separated sequence of integers, with front on left.
    List copy(){
        List newList = new List();
        newList.front = this.front;
        Node temp = this.front;
        Node newTemp = newList.front;
        newList.size = this.size;
        while(temp != null){
            temp = temp.next;
            newTemp.next = temp;
            newTemp = newTemp.next;
        }
        return newList;
    }               // Returns a new List representing the same integer sequence as this
                    // List. The cursor in the new list is undefined, regardless of the
                    // state of the cursor in this List. This List is unchanged.
}
