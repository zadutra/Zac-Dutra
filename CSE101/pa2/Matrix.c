#include<stdio.h>
#include<stdlib.h>
#include "List.h"
typedef struct NodeObj{
   void* data;
   struct NodeObj* next;
} NodeObj;

// private Node type
typedef NodeObj* Node;

// private QueueObj type
typedef struct ListObj{
   Node front;
   Node back;
   Node cursor;
   int length;
   int index;
} ListObj;

typedef struct EntryObj{
    int column;
    double data;
} EntryObj;

typedef EntryObj* Entry;

typedef struct MatrixObj{
    int size;
    int NNZ;
    List* arrList;
} MatrixObj;

typedef MatrixObj* Matrix;

Entry newEntry(int c, double d){
    Entry e = malloc(sizeof(EntryObj));
    e->column = c;
    e->data = d;
    return e;
};

void printEntry(FILE* out, Entry E){
    fprintf(out, "(%d, %.1f) ", E->column, E->data);
};

Matrix newMatrix(int n){
    Matrix m = malloc(sizeof(MatrixObj));
    m->size = n;
    m->NNZ = 0;
    m->arrList = malloc(sizeof(ListObj)*(n+1));
    for(int i = 1; i <= n+1; i++){
        m->arrList[i] = newList();
    }
    return m;
};

void freeMatrix(Matrix* pM){

};

//Access functions

    int size(Matrix M){
        return (int)M->size;
    };

    int NNZ(Matrix M){
        return (int)M->NNZ;
    };

    int equals(Matrix A, Matrix B){
        if(A->size != B->size){
            return 0;
        }
        else{
            for(int i = 1; i <= A->size; i++){
                if(get(A->arrList[i]) != (get(B->arrList[i]))){
                    return 0;
                }
            }
        }
        return 1;
    };

    double dot(List P, List Q){
        double sum = 0;
        moveFront(P);
        moveFront(Q);
        for(int i = 0; i < length(P); i++){
            if(P->cursor == NULL || Q->cursor == NULL){
                break;
            }
            Entry p = (Entry) get(P);
            Entry q = (Entry) get(Q);
            if(p->column > q->column){
                moveNext(Q);
                i--;
                continue;
            }
            else if(q->column > p->column){
                moveNext(P);
                i--;
                continue;
            }
            sum += p->data * q->data;
            moveNext(P);
            moveNext(Q);
        }
        return sum;
    };
//manipulation procedures
    void makeZero(Matrix M){
        for(int i = 1; i <= M->size; i++ ){
            clear(M->arrList[i]);
        }
        M->NNZ = 0;
        return;
    };

    void changeEntry(Matrix M, int i, int j, double x){
       // fprintf(stdout, "%d, %d\n", i, j);
        if(i < 1 || i > M->size || j < 1 || j > M->size){
            printf("change entry location not within matrix bounds");
            return;
        }
        if(length(M->arrList[i]) == 0 && x != 0){ //check for empty list
            Entry temp = newEntry(j, x);
            prepend(M->arrList[i], temp);
            moveFront(M->arrList[i]);
            M->NNZ++;
            return;
        }
        if(length(M->arrList[i]) == 0 && x == 0){ //if empty list and x == 0, return
            return;
        }
        else{
        moveFront(M->arrList[i]);
        for(int k = 1; k <= M->size; k++){
            Entry temp3 = (Entry) get(M->arrList[i]);
            if(temp3->column == j){ //current entry exists, change data value
                if(x == 0 && temp3->data != 0){//deletes current entry to make it zero
                    delete(M->arrList[i]);
                    M->NNZ--;
                    return;
                }
                else if( x != 0 && temp3->data != 0){ //change current NNZ data to new data
                    Entry temp = newEntry(j ,x);
                    insertBefore(M->arrList[i], temp);
                    movePrev(M->arrList[i]);
                    deleteNext(M->arrList[i]);
                    return;
                }
            }
            if(j > temp3->column){ //if entered this loop, that means the value at that column is 0
                if(x == 0){ //if trying to change to zero, do nothing
                    return;
                }
                else{
                    Entry temp = newEntry(j ,x);
                    moveFront(M->arrList[i]);
                    for(int q = 0; q < length(M->arrList[i]); q++){
                        Entry temp2 = (Entry) get(M->arrList[i]);
                        if( j < temp2->column){
                            insertBefore(M->arrList[i], temp);
                            M->NNZ++;
                            return;
                        }
                        moveNext(M->arrList[i]);
                    }
                    // did not meet condidions of for loop, append newest addition
                    append(M->arrList[i], temp);
                    M->NNZ++;
                    moveFront(M->arrList[i]);
                    return;
                }
            }
            moveNext(M->arrList[i]);
          }
        }
    };
    
    Matrix copy(Matrix A){
        Matrix newM = newMatrix(A->size);
        for(int i = 1; i <= A->size; i++){
            moveFront(A->arrList[i]);
            for(int j = 1; j <= length(A->arrList[i]); j++){
                Entry temp = (Entry) get(A->arrList[i]);
                changeEntry(newM, i, temp->column, temp->data);
                moveNext(A->arrList[i]);
            }
        }
        return newM;
    };

    Matrix scalarMult(double x, Matrix A){
        Matrix newM = newMatrix(A->size);
        if(x == 0){
            return newM;
        }
        else{
            for(int i = 1; i <= A->size; i++){
                moveFront(A->arrList[i]);
                for(int j = 0; j < length(A->arrList[i]); j++){
                    Entry T = (Entry) get(A->arrList[i]);
                    double temp = x * T->data;
                    changeEntry(newM, i, T->column, temp);
                    moveNext(A->arrList[i]);
                }
                moveFront(A->arrList[i]);
            }
            return newM;
        }
    };

    Matrix sum(Matrix A, Matrix B){
        if(A->size != B->size){
            printf("Adding Matricies of different sizes");
            exit(1);
        }
        if(equals(A, B) == 1){
            return scalarMult(2.0, A);
        }
        double newVal;
        int len;
        Matrix newM = newMatrix(A->size);
        for(int i = 1; i <= A->size; i++){
            moveFront(B->arrList[i]);
            moveFront(A->arrList[i]);
            //get bigger array size for for loop
            if(length(A->arrList[i]) >= length(B->arrList[i])){
                len = length(A->arrList[i]);
            }
            else{
                len = length(B->arrList[i]);
            }
            for(int j = 0; j < len; j++){
                if(A->arrList[i]->cursor == NULL){
                    if(B->arrList[i]->cursor != NULL){ // if reached the end of A->List and B->List has not reached the end
                        Entry temp = (Entry) get(B->arrList[i]);
                        changeEntry(newM, i, temp->column, temp->data);
                        moveNext(B->arrList[i]);
                        continue;
                    }
                    else{
                        break;
                    }
                }
                //opposite of previous statement
                else if(B->arrList[i]->cursor == NULL){
                    if(A->arrList[i]->cursor != NULL){
                        Entry temp = (Entry) get(A->arrList[i]);
                        changeEntry(newM, i, temp->column, temp->data);
                        moveNext(A->arrList[i]);
                        continue;
                    }
                    else{
                        break;
                    }
                }
                Entry a_ent = (Entry) get(A->arrList[i]);
                Entry b_ent = (Entry) get(B->arrList[i]);
                //if there was a zero in this this.List, insert data from M.list
                if(a_ent->column > b_ent->column){
                    changeEntry(newM, i, b_ent->column, b_ent->data);
                    moveNext(B->arrList[i]);
                    continue;
                }
                //opposite of previous
                else if(a_ent->column < b_ent->column){
                    changeEntry(newM, i, a_ent->column, a_ent->data);
                    moveNext(A->arrList[i]);
                    continue;
                }
                //none of previous statements were true, add the two columns and insert
                else{
                    fprintf(stdout, "in add condition\n");
                    newVal = a_ent->data + b_ent->data;
                     fprintf(stdout, "before change entry\n");
                    changeEntry(newM, i, a_ent->column, newVal);
                    moveNext(A->arrList[i]);
                    moveNext(B->arrList[i]);
                }
            }
        } 
        return newM;
    };

    Matrix diff(Matrix A, Matrix B){
        if(A->size != B->size){
            printf("Subtracting Matricies of different sizes");
            exit(1);
        }
        Matrix empty = newMatrix(A->size);
        if(equals(A,B) == 1){
            return empty;
        }
        Matrix temp = scalarMult(-1.0, B);
         fprintf(stdout, "In diff\n");
        Matrix newM = sum(A, temp);     
        return newM;
    };

    Matrix transpose(Matrix M){
        Matrix newM = newMatrix(M->size);
        for(int i = 1; i <= M->size; i++){
            moveFront(M->arrList[i]);
            for(int j = 1; j <= length(M->arrList[i]); j++){
                int count = 0;
                Entry temp = (Entry) get(M->arrList[i]);
                while(temp->column != j){
                    j++;
                    count++;
                }
                changeEntry(newM, j, i, temp->data);
                moveNext(M->arrList[i]);
                if( count > 0){
                    j = j - count;
                }
            }
            moveFront(M->arrList[i]);
        }
        return newM;
    };

    Matrix product(Matrix A, Matrix B){
        if(A->size != B->size){
            printf("Multiplying Matricies of different sizes");
            exit(1);
        }
        Matrix newM = newMatrix(A->size);
        Matrix temp = transpose(B);
        for(int k = 1; k <= A->size; k++){
            moveFront(temp->arrList[k]);
        }
        for(int i = 1; i <= A->size; i++){
            for(int j = 1; j <= B->size; j++){
                double product = dot(A->arrList[i], temp->arrList[j]);
                changeEntry(newM, i, j, product);
            }
            
        }
        return newM;
    };

    void printMatrix(FILE* out, Matrix M){
        if(M == NULL){
            printf("Matrix Error: calling printMatrix() on Null Matrix reference");
            exit(1);
        }
        for(int i = 1; i <= M->size; i++){
            if(length(M->arrList[i]) == 0){
                continue;
            }
            fprintf(out, "%d: ", i);
            moveFront(M->arrList[i]);
            for(int j = 0; j < length(M->arrList[i]); j++){
                Entry ugh = get(M->arrList[i]);
                printEntry(out, ugh);
                moveNext(M->arrList[i]);
            }
            fprintf(out, "\n");
        }
        fprintf(out, "\n");
    };