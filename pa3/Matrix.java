
class Entry{
    int column;
    double data;

    Entry(int column, double data){
        this.column = column;
        this.data = data;
    }

    public String toString(){
        return column + ", " + data;
    }
}
class Matrix{
    int size;
    int NNZ;
    List[] arrList;
    Matrix(int n){
        if(n <= 0){
            System.out.println("Cannot make a matrix of length 0");
        }
        else{
            this.size = n;
            NNZ = 0;
            arrList = new List[n+1];
            for(int i = 1; i <= n; i++){
                arrList[i] = new List();
            }
        }
    }

    int getSize(){
        return this.size;
    }

    int getNNZ(){
        return this.NNZ;
    }

    public boolean equals(Matrix M){
        if(this.size != M.getSize()){
            return false;
        }
        else{
            for(int i = 1; i <= this.size; i++){
                if(this.arrList[i].equals(M.arrList[i]) == false){
                    return false;
                }
            }
        }
        return true;
    }

    private static double dot(List P, List Q){
        double sum = 0;
        P.moveFront();
        Q.moveFront();
        for(int i = 0; i < P.length(); i++){
            if(P.cursor == null || Q.cursor == null){
                break;
            }
            Entry p = (Entry) P.get();
            Entry q = (Entry) Q.get();
            if(p.column > q.column){
                Q.moveNext();
                i--;
                continue;
            }
            else if(q.column > p.column){
                P.moveNext();
                i--;
                continue;
            }
            sum += p.data * q.data;
            P.moveNext();
            Q.moveNext();
        }
        return sum;
    }

    void makeZero(){
        for(int i = 1; i <= this.size; i++ ){
            arrList[i].clear();
        }
        this.NNZ = 0;
        return;
    }

    Matrix copy(){
        Matrix newM = new Matrix(this.size);
        for(int i = 1; i <= this.size; i++){
            this.arrList[i].moveFront();
            for(int j = 1; j <= this.arrList[i].length(); j++){
                Entry temp = (Entry) this.arrList[i].get();
                newM.changeEntry(i, temp.column, temp.data);
                this.arrList[i].moveNext();
            }
        }
        return newM;
    }

    void changeEntry(int i, int j, double x){
        if(i < 1 || i > this.size || j < 1 || j > this.size){
            System.out.println("change entry location not within matrix bounds");
            return;
        }
        if(arrList[i].length() == 0 && x != 0){ //check for empty list
            Entry temp = new Entry(j, x);
            arrList[i].prepend(temp);
            arrList[i].moveFront();
            NNZ++;
            return;
        }
        else{
        arrList[i].moveFront();
        for(int k = 1; k <= this.size; k++){
            Entry temp3 = (Entry)arrList[i].get();
            if(temp3.column == j){ //current entry exists, change data value
                if(x == 0 && temp3.data != 0){//deletes current entry to make it zero
                    arrList[i].delete();
                    this.NNZ--;
                    return;
                }
                else if( x != 0 && temp3.data != 0){ //change current NNZ data to new data
                    Entry temp = new Entry(j ,x);
                    arrList[i].insertBefore(temp);
                    arrList[i].movePrev();
                    arrList[i].deleteNext();
                    return;
                }
            }
            if(j > temp3.column){ //if entered this loop, that means the value at that column is 0
                if(x == 0){ //if trying to change to zero, do nothing
                    return;
                }
                else{
                    Entry temp = new Entry(j ,x);
                    arrList[i].moveFront();
                    for(int q = 0; q < arrList[i].length(); q++){
                        Entry temp2 = (Entry) arrList[i].get();
                        if( j < temp2.column){
                            arrList[i].insertBefore(temp);
                            NNZ++;
                            return;
                        }
                        arrList[i].moveNext();
                    }
                    // did not meet condidions of for loop, append newest addition
                    arrList[i].append(temp);
                    NNZ++;
                    return;
                }
            }
            arrList[i].moveNext();
          }
        }
        
    }

    Matrix scalarMult(double x){
        Matrix newM = new Matrix(this.size);
        if(x == 0){
            return newM;
        }
        else{
            for(int i = 1; i <= this.size; i++){
                this.arrList[i].moveFront();
                for(int j = 0; j < this.arrList[i].length(); j++){
                    Entry T = (Entry) this.arrList[i].get();
                    double temp = x * T.data;
                    newM.changeEntry(i, T.column, temp);
                    this.arrList[i].moveNext();
                }
                this.arrList[i].moveFront();
            }
            return newM;
        }
    }

    Matrix add(Matrix M){
        if(this.size != M.getSize()){
            System.out.println("Adding Matricies of different sizes");
            System.exit(1);
        }
        if(this == M){
            return M.scalarMult(2.0);
        }
        double newVal;
        int length;
        Matrix newM = new Matrix(this.size);
        for(int i = 1; i <= this.size; i++){
            M.arrList[i].moveFront();
            this.arrList[i].moveFront();
            //get bigger array size for for loop
            if(this.arrList[i].length() >= M.arrList[i].length()){
                length = this.arrList[i].length();
            }
            else{
                length = M.arrList[i].length();
            }
            for(int j = 0; j <= length; j++){
                if(this.arrList[i].cursor == null){
                    if(M.arrList[i].cursor != null){ // if reached the end of this.List and M.List has not reached the end
                        Entry temp = (Entry) M.arrList[i].get();
                        newM.changeEntry(i, temp.column, temp.data);
                        M.arrList[i].moveNext();
                        continue;
                    }
                    else{
                        break;
                    }
                }
                //opposite of previous statement
                else if(M.arrList[i].cursor == null){
                    if(this.arrList[i].cursor != null){
                        Entry temp = (Entry) this.arrList[i].get();
                        newM.changeEntry(i, temp.column, temp.data);
                        this.arrList[i].moveNext();
                        continue;
                    }
                    else{
                        break;
                    }
                }
                Entry this_ent = (Entry) this.arrList[i].get();
                Entry m_ent = (Entry) M.arrList[i].get();
                //if there was a zero in this this.List, insert data from M.list
                if(this_ent.column > m_ent.column){
                    newM.changeEntry(i, m_ent.column, m_ent.data);
                    M.arrList[i].moveNext();
                    continue;
                }
                //opposite of previous
                else if(this_ent.column < m_ent.column){
                    newM.changeEntry(i, this_ent.column, this_ent.data);
                    this.arrList[i].moveNext();
                    continue;
                }
                //none of previous statements were true, add the two columns and insert
                else{
                    newVal = this_ent.data + m_ent.data;
                    newM.changeEntry(i, this_ent.column, newVal);
                    this.arrList[i].moveNext();
                    M.arrList[i].moveNext();
                }
            }
        } 
        return newM;
    }

    Matrix sub(Matrix M){
        if(this.size != M.getSize()){
            System.out.println("Subtracting Matricies of different sizes");
            System.exit(1);
        }
        Matrix empty = new Matrix(this.size);
        if(this == M){
            return empty;
        }
        double newVal;
        int length;
        Matrix temp = M.scalarMult(-1.0);
        Matrix newM = this.add(temp);        
        return newM;
    }

    Matrix transpose(){
        Matrix newM = new Matrix(this.size);
        for(int i = 1; i <= this.size; i++){
            this.arrList[i].moveFront();
            for(int j = 1; j <= this.arrList[i].length(); j++){
                int count = 0;
                Entry temp = (Entry) this.arrList[i].get();
                while(temp.column != j){
                    j++;
                    count++;
                }
                newM.changeEntry(j, i, temp.data);
                this.arrList[i].moveNext();
                if( count > 0){
                    j = j - count;
                }
            }
            this.arrList[i].moveFront();
        }
        return newM;
    }

    Matrix mult(Matrix M){
        if(this.size != M.getSize()){
            System.out.println("Multiplying Matricies of different sizes");
            System.exit(1);
        }
        Matrix newM = new Matrix(this.size);
        Matrix temp = M.transpose();
        for(int k = 1; k <= this.size; k++){
            temp.arrList[k].moveFront();
        }
        for(int i = 1; i <= this.size; i++){
            for(int j = 1; j <= M.size; j++){
                double product = dot(this.arrList[i], temp.arrList[j]);
                newM.changeEntry(i, j, product);
            }
            
        }
        return newM;
    }

    public String toString(){
        String output = "";
        for(int i = 1; i <= this.size; i++){
            if(arrList[i].length() == 0){
                continue;
            }
            output += i + ":" + arrList[i].toString() + "\n";
        }
        return output;
    }
}