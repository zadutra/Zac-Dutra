private class Node{
    int data;
    Node next;

    Node(int data){
        this.data = data;
        this.next = null;
    }

    public string toString(){
        return String.valueOf(data);
    }
}

class List{
    Node front;
    Node back;
    Node cursor;
    int size;
    List(){ // Creates a new empty list.
         this.front = this.back = this.cursor = null;
         size = 0;
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
                return this.cursor.data;
            }           
        }
    int front(){
            return front.data;
        }           // Returns front element. Pre: length()>0
    int back(){
            return back.data;
        }           // Returns back element. Pre: length()>0
    int get(){
            if(this.cursor==null||size==0){
                return -1;
            }
            else{
                return this.cursor.data;
            }
        }           // Returns cursor element. Pre: length()>0, index()>=0
    boolean equals(List L){
            Node temp = this.front;
            Node temp2 = L.front;
            if(this.size!=L.size){
                    return false;
            }
            for(int i = 0, i < this.size, i++){
                if(temp.data!=temp2.data){
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
        }            // Resets this List to its original empty state.
    void moveFront(){
            if(size==0){
                return;
            }
            this.cursor = this.front;
            return;
        }           // If List is non-empty, places the cursor under the front element,
                    // otherwise does nothing.
    void moveBack(){
            if(size==0){
                return;
            }
            this.cursor = this.back;
            return;
    }               // If List is non-empty, places the cursor under the back element,
                    // otherwise does nothing.
    void movePrev(){
            if(this.cursor==null){
                return;
            }
            else if(this.cusor==this.front){
                this.cursor = null;
                return;
            }
            else{
                Node temp = this.front;
                while(temp.next!=this.cursor){
                    temp = temp.next;
                }
                this.cursor = temp;
                return;
            }
    }               // If cursor is defined and not at front, moves cursor one step toward
                    // front of this List, if cursor is defined and at front, cursor becomes
                    // undefined, if cursor is undefined does nothing.
    void moveNext(){
            if(this.cursor == this.back){
                this.cursor == null
                return;
            }
            else if(this.cursor == null){
                return;
            }
            else{
                this.cursor = this.cursor.next;
                return;
            }
    }               // If cursor is defined and not at back, moves cursor one step toward
                    // back of this List, if cursor is defined and at back, cursor becomes
                    // undefined, if cursor is undefined does nothing.
    void prepend(int data){
            if(size == 0){
                Node temp = new Node(data);
                this.front = this.back = temp;
                size++;
                return;
            }
            else{
                Node temp = new Node(data);
                temp.next = this.front;
                this.front = temp;
                size++;
                return;
            }
    }                // Insert new element into this List. If List is non-empty,
                     // insertion takes place before front element.
    void append(int data){
            if(size==0){
                Node temp = new Node(data);
                this.front = this.back = temp;
                size++;
                return;
            }
            else{
                Node temp = new Node(data);
                this.back.next = temp;
                this.back = temp;
                size++;
                return;
            }

    }                // Insert new element into this List. If List is non-empty,
                    // insertion takes place after back element.
    void insertBefore(int data){

        size++;
    }               // Insert new element before cursor.
                    // Pre: length()>0, index()>=0
    void insertAfter(int data){
        size++;
    }               // Inserts new element after cursor.
                    // Pre: length()>0, index()>=0
    void deleteFront(){
        if(size==0){
            return;
        }
        this.front = this.front.next;
        return;
    }               // Deletes the front element. Pre: length()>0
    void deleteBack(){
        if(size==0){
            return;
        }
        Node deltemp = this.front;
        while(deltemp.next!=this.back){
            deltemp = deltemp.next;
        }
        deltemp.next = null;
        this.back = deltemp;
        return;
    }               // Deletes the back element. Pre: length()>0

    void delete(){
            
    }               // Deletes cursor element, making cursor undefined.
                    // Pre: length()>0, index()>=0
                    // Other methods
    public String toString(){

    }               // Overrides Object's toString method. Returns a String
                    // representation of this List consisting of a space
                    // separated sequence of integers, with front on left.
    List copy(){

    }               // Returns a new List representing the same integer sequence as this
                    // List. The cursor in the new list is undefined, regardless of the
                    // state of the cursor in this List. This List is unchanged.
}
}