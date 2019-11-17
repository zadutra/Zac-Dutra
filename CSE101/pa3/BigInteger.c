//-----------------------------------------------------------------------------
// BigInteger.c
// Zachary Dutra
// zdutra
// 1581789
// pa3
//-----------------------------------------------------------------------------
#include<stdio.h>
#include<stdlib.h>
#include "BigInteger.h"

typedef struct NodeObj{
   void* data;
   struct NodeObj* next;
} NodeObj;

// private Node type
typedef NodeObj* Node;

typedef struct ListObj{
   Node front;
   Node back;
   Node cursor;
   int length;
   int index;
} ListObj;

// Exported type -------------------------------------------------------------
// BigInteger reference type

typedef struct BigIntegerObj{
    int sign;
    List nums;
} BigIntegerObj;

// Constructors-Destructors ---------------------------------------------------
// newBigInteger()
// Returns a reference to a new BigInteger object in the zero state.
BigInteger newBigInteger(void){
    BigInteger b;
    b = malloc(sizeof(BigInteger));
    b->sign = 0;
    b->nums = newList();
    return b;
};
// freeBigInteger()
// Frees heap memory associated with *pN, sets *pN to NULL.
void freeBigInteger(BigInteger* pN){
    free(*pN);
    *pN = NULL;
};
// Access functions -----------------------------------------------------------
// sign()
// Returns -1 if N is negative, 1 if N is positive, and 0 if N is in the zero
// state.
int sign(BigInteger N){
    return N->sign;
};
// compare()
// Returns -1 if A<B, 1 if A>B, and 0 if A=B.
int compare(BigInteger A, BigInteger B){
    if(length(A) > length(B)){
        return 1;
    }
    if(length(B) > length(A)){
        return -1;
    }
    //if here A and B are same length
    if(equals(A,B) == 1){
        return 0;
    }
    long a = front(A->nums);
    long b = front(B->nums);
    for(int i = 0; i < length(A->nums); i++){

    }
};
// equals()
// Return true (1) if A and B are equal, false (0) otherwise.
int equals(BigInteger A, BigInteger B){
    if(A->sign != B->sign){
        return 0;
    }

    if(length(A->nums) != length(B->nums)){
        return 0;
    }
    moveFront(A->nums);
    moveFront(B->nums);
    for(int i = 0; i < length(A->nums); i++){
        if(get(A) != get(B)){
            return 0;
        }
        moveNext(A);
        moveNext(B);
    }
    return 1;
};

// Manipulation procedures ----------------------------------------------------
// makeZero()
// Re-sets N to the zero state.
void makeZero(BigInteger N){
    N->sign = 0;
    clear(N->nums);
    append(N->nums, 0);
    return;
};
// negate()
// Reverses the sign of N: positive <--> negative. Does nothing if N is in the
// zero state.
void negate(BigInteger N){
    if(N->sign == -1){
        N->sign = 1;
        return;
    }
    else if(N->sign == 1){
        N->sign = -1;
        return;
    }
    else{
        return;
    }
};
// BigInteger Arithmetic operations -----------------------------------------------
// stringToBigInteger()
// Returns a reference to a new BigInteger object representing the decimal integer
// represented in base 10 by the string s.
// Pre: s is a non-empty string containing only base ten digits {0,1,2,3,4,5,6,7,8,9}
// and an optional sign {+, -} prefix.
BigInteger stringToBigInteger(char* s){
    int temp;
    int set;
    BigInteger A = newBigInteger();
    if(s[0] == '-'){
        A->sign = -1;
    }
    else{
        A->sign = 1;
    }
    temp = atoi(s);
    while(temp > 0){
        set = temp%100;
        prepend(A->nums, set);
        temp = temp/100;
    }
    return A;
};
// copy()
// Returns a reference to a new BigInteger object in the same state as N.
BigInteger copy(BigInteger N){
    BigInteger temp = newBigInteger();
    temp->sign = N->sign;
    moveFront(N->nums);
    for(int i = 0; i < length(N->nums); i++){
        if(i == 0){
            prepend(temp->nums, get(N->nums));
            moveFront(temp->nums);
            moveNext(N->nums);
        }
        insertAfter(temp->nums, get(N->nums));
        moveNext(temp->nums);
        moveNext(N->nums);
    }
    return temp;
};
// add()
// Places the sum of A and B in the existing BigInteger S, overwriting its
// current state: S = A + B
void add(BigInteger S, BigInteger A, BigInteger B){
    int len;
    int temp;
    int check = -1;
    int carry = 0;
    //check for A and B signs to maybe call subtract
    if(A->sign == 1 && B->sign == -1){
        B->sign = 1;
        subtract(S, A, B);
        B->sign = -1;
        return;
    }
    if(A->sign == -1 && B->sign == 1){
        A->sign = 1;
        subtract(S, B, A);
        A->sign = -1;
        return;
    }
    //Sign of S check
    if(A->sign == -1 && B->sign == -1){
        S->sign = -1;
    }
    else {
       S->sign = 1; 
    }
    //checking BinInt sizes to get length of S
    if(length(A->nums) > length(B->nums)){
        len = length(A->nums);
        check = 1;
    }
    else if(length(A->nums) < length(B->nums)){
        len = length(B->nums);
        check = 2;
    }
    else{ //BinInts are same length
        len = length(B->nums);
        check = 3;
    }
    clear(S->nums);
    for(int i = 0; i < len; i++){
        append(S->nums, 11);
    }
    moveBack(A->nums);
    moveBack(B->nums);
    moveBack(S->nums);
    if(check == 1){ // a is greater than b, after b length, set raminder of S to A
        for(int i = 0; i < length(B); i++){
            temp = get(A->nums) + get(B->nums) + carry;
            set(S, temp%100);
            carry = temp/100;
            moveprev(A->nums);
            moveprev(B->nums);
            moveprev(S->nums);
        }
        for(int i = 0; i < (length(A) - length(B)); i++){
            set(S, get(A) + carry);
            carry = 0;
            movePrev(S->nums);
            movePrev(A->nums);
        }
        return;
    }
    else if(check == 2){ //B is greater than A, after length A, set S to remainder of B
        for(int i = 0; i < length(A); i++){
            temp = get(A->nums) + get(B->nums) + carry;
            set(S, temp%100);
            carry = temp/100;
            moveprev(A->nums);
            moveprev(B->nums);
            moveprev(S->nums);
        }
        for(int i = 0; i < (length(B) - length(A)); i++){
            set(S, get(B) + carry);
            carry = 0;
            movePrev(S->nums);
            movePrev(B->nums);
        }
        return;
    }
    else{ //lengths are the same
        for(int i = 0; i < length(A); i++){
            temp = get(A->nums) + get(B->nums) + carry;
            set(S, temp%100);
            carry = temp/100;
            moveprev(A->nums);
            moveprev(B->nums);
            moveprev(S->nums);
        }
        return;
    }
};
// sum()
// Returns a reference to a new BigInteger object representing A + B.
BigInteger sum(BigInteger A, BigInteger B){
    int len;
    int temp;
    int check = -1;
    int carry = 0;
    BigInteger S = newBigInteger();
    //check for A and B signs to maybe call subtract
    if(A->sign == 1 && B->sign == -1){
        B->sign = 1;
        subtract(S, A, B);
        B->sign = -1;
        return S;
    }
    if(A->sign == -1 && B->sign == 1){
        A->sign = 1;
        subtract(S, B, A);
        A->sign = -1;
        return S;
    }
    //Sign of S check
    if(A->sign == -1 && B->sign == -1){
        S->sign = -1;
    }
    else {
       S->sign = 1; 
    }
    //checking BinInt sizes to get length of S
    if(length(A->nums) > length(B->nums)){
        len = length(A->nums);
        check = 1;
    }
    else if(length(A->nums) < length(B->nums)){
        len = length(B->nums);
        check = 2;
    }
    else{ //BinInts are same length
        len = length(B->nums);
        check = 3;
    }
    for(int i = 0; i < len; i++){
        append(S->nums, 11);
    }
    moveBack(A->nums);
    moveBack(B->nums);
    moveBack(S->nums);
    if(check == 1){ // a is greater than b, after b length, set remainder of S to A
        for(int i = 0; i < length(B); i++){
            temp = get(A->nums) + get(B->nums) + carry;
            set(S, temp%100);
            carry = temp/100;
            moveprev(A->nums);
            moveprev(B->nums);
            moveprev(S->nums);
        }
        for(int i = 0; i < (length(A) - length(B)); i++){
            set(S, get(A) + carry);
            carry = 0;
            movePrev(S->nums);
            movePrev(A->nums);
        }
        return S;
    }
    else if(check == 2){ //B is greater than A, after length A, set S to remainder of B
        for(int i = 0; i < length(A); i++){
            temp = get(A->nums) + get(B->nums) + carry;
            set(S, temp%100);
            carry = temp/100;
            moveprev(A->nums);
            moveprev(B->nums);
            moveprev(S->nums);
        }
        for(int i = 0; i < (length(B) - length(A)); i++){
            set(S, get(B) + carry);
            carry = 0;
            movePrev(S->nums);
            movePrev(B->nums);
        }
        return S;
    }
    else{ //lengths are the same
        for(int i = 0; i < length(A); i++){
            temp = get(A->nums) + get(B->nums) + carry;
            set(S, temp%100);
            carry = temp/100;
            moveprev(A->nums);
            moveprev(B->nums);
            moveprev(S->nums);
        }
        return S;
    }
};
// subtract()
// Places the difference of A and B in the existing BigInteger D, overwriting
// its current state: D = A - B
void subtract(BigInteger D, BigInteger A, BigInteger B){
    int len;
    int temp;
    int check = -1;
    int carry = 0;
    movefront(A->nums);
    movefront(B->nums);
    if(equals(A,B)){
        makeZero(D);
        return;
    }
    //check A and B to see if you can call add
    if(A->sign == 1 && B->sign == -1){
        B->sign == 1;
        add(D, A, B);
        B->sign == -1;
        return;
    }
    if(A->sign == -1 && B->sign == 1){
        B->sign = -1;
        add(D, A, B);
        B->sign = 1;
        return;
    }
    //check for B - A
    if(A->sign == -1 && B->sign == -1){
        B->sign = 1;
        A->sign = 1;
        subtract(D, B, A);
        B->sign = -1;
        A->sign = -1;
        return;
    }
    //check which has bigger length
    if(length(A) > length(B)){
        check = 1;
        len = length(A);
        D->sign = 1;
    }
    else if(length(B) > length(A)){
        check = 2;
        len = length(B);
        D->sign = -1;
    }
    else{//lengths are the same
        check = 3;
        len = length(B);
        for(int i = 0; i < len; i++){
            if(get(A) > get(B)){
                D->sign = 1;
            }
            if(get(A) < get(B)){
                D->sign = -1;
            }
            moveNext(A->nums);
            moveNext(B->nums);
        }
    }
    clear(D->nums);
    moveBack(A->nums);
    moveBack(B->nums);
    moveBack(D->nums);
    if(check == 1){//A is larger than B, fill D with rest of A after B length
        for(int i = 0; i < length(B->nums); i++){
            temp = get(A) - get(B) + carry;
            if(temp < 0){
                temp += 100;
                carry = -1;
            }
            else{
                carry = 0;
            }
            set(D->nums, temp);
            movePrev(A->nums);
            movePrev(B->nums);
            movePrev(D->nums);
        }
        for(int i = 0; i < (length(A) - length(B)); i++){
            set(D->nums, get(A) + carry);
            carry = 0;
            movePrev(D->nums);
            movePrev(A->nums);
        }
        return;
    }
    if(check == 2){//B is larger than A, fill D with rest of B after A length
        for(int i = 0; i < length(B->nums); i++){
            temp = get(A) - get(B) + carry;
            if(temp < 0){
                temp += 100;
                carry = -1;
            }
            else{
                carry = 0;
            }
            set(D->nums, temp);
            movePrev(A->nums);
            movePrev(B->nums);
            movePrev(D->nums);
        }
        for(int i = 0; i < (length(B) - length(A)); i++){
            set(D->nums, get(B) + carry);
            carry = 0;
            movePrev(D->nums);
            movePrev(B->nums);
        }
        return;
    }
    else{//A and B are the same length
        for(int i = 0; i < length(B->nums); i++){
            temp = get(A) - get(B) + carry;
            if(temp < 0){
                temp += 100;
                carry = -1;
            }
            else{
                carry = 0;
            }
            set(D->nums, temp);
            movePrev(A->nums);
            movePrev(B->nums);
            movePrev(D->nums);
        }
        return;
    }
};
// diff()
// Returns a reference to a new BigInteger object representing A - B.
BigInteger diff(BigInteger A, BigInteger B){
    int len;
    int temp;
    int check = -1;
    int carry = 0;
    BigInteger D = newBigInteger();
    movefront(A->nums);
    movefront(B->nums);
    if(equals(A,B)){
        makeZero(D);
        return D;
    }
    //check A and B to see if you can call add
    if(A->sign == 1 && B->sign == -1){
        B->sign == 1;
        add(D, A, B);
        B->sign == -1;
        return D;
    }
    if(A->sign == -1 && B->sign == 1){
        B->sign = -1;
        add(D, A, B);
        B->sign = 1;
        return D;
    }
    //check for B - A
    if(A->sign == -1 && B->sign == -1){
        B->sign = 1;
        A->sign = 1;
        subtract(D, B, A);
        B->sign = -1;
        A->sign = -1;
        return D;
    }
    //check which has bigger length
    if(length(A) > length(B)){
        check = 1;
        len = length(A);
        D->sign = 1;
    }
    else if(length(B) > length(A)){
        check = 2;
        len = length(B);
        D->sign = -1;
    }
    else{//lengths are the same
        check = 3;
        len = length(B);
        for(int i = 0; i < len; i++){
            if(get(A) > get(B)){
                D->sign = 1;
            }
            if(get(A) < get(B)){
                D->sign = -1;
            }
            moveNext(A->nums);
            moveNext(B->nums);
        }
    }
    clear(D->nums);
    moveBack(A->nums);
    moveBack(B->nums);
    moveBack(D->nums);
    if(check == 1){//A is larger than B, fill D with rest of A after B length
        for(int i = 0; i < length(B->nums); i++){
            temp = get(A) - get(B) + carry;
            if(temp < 0){
                temp += 100;
                carry = -1;
            }
            else{
                carry = 0;
            }
            set(D->nums, temp);
            movePrev(A->nums);
            movePrev(B->nums);
            movePrev(D->nums);
        }
        for(int i = 0; i < (length(A) - length(B)); i++){
            set(D->nums, get(A) + carry);
            carry = 0;
            movePrev(D->nums);
            movePrev(A->nums);
        }
        return D;
    }
    if(check == 2){//B is larger than A, fill D with rest of B after A length
        for(int i = 0; i < length(B->nums); i++){
            temp = get(A) - get(B) + carry;
            if(temp < 0){
                temp += 100;
                carry = -1;
            }
            else{
                carry = 0;
            }
            set(D->nums, temp);
            movePrev(A->nums);
            movePrev(B->nums);
            movePrev(D->nums);
        }
        for(int i = 0; i < (length(B) - length(A)); i++){
            set(D->nums, get(B) + carry);
            carry = 0;
            movePrev(D->nums);
            movePrev(B->nums);
            }
        return D;
    }
    else{//A and B are the same length
        for(int i = 0; i < length(B->nums); i++){
            temp = get(A) - get(B) + carry;
            if(temp < 0){
                temp += 100;
                carry = -1;
            }
            else{
                carry = 0;
            }
            set(D->nums, temp);
            movePrev(A->nums);
            movePrev(B->nums);
            movePrev(D->nums);
        }
        return D;
    }
};
// multiply()
// Places the product of A and B in the existing BigInteger P, overwriting
// its current state: P = A*B
void multiply(BigInteger P, BigInteger A, BigInteger B){
    int carry = 0;
    int temp;
    int set;
    int new;
    int b;
    long sum;
    if(length(B) > length(A)){
        multiply(P,B,A);
        return;
    }
    if(A->sign == -1 && B->sign == 1){
        P->sign = -1;
    }
    else if(A->sign == 1 && B->sign == -1){
        P->sign = -1;
    }
    else{
        P->sign = 1;
    }
    clear(P->nums);
    moveBack(A->nums);
    moveback(B->nums);
    for(int i = 0; i < length(B)*2; i++){
        if(i == 0 || i%2 == 0){
            b = get(B->nums)%10;
        }
        else{
            b = get(B->nums)/10;
        }
        for(int j = 0; j < length(A)*2; j++){
            int a = get(A->nums)%10;
            temp = (b*a) + carry;
            carry = temp/10;
            set = temp%10;
            a = get(A->nums)/10;
            temp = (b*a) + carry;
            carry = temp % 10;
            new = temp/10;
            sum = (new*10) + set;
            prepend(P->nums, sum);
        }
    }
    return;
};
// prod()
// Returns a reference to a new BigInteger object representing A*B
BigInteger prod(BigInteger A, BigInteger B){
    BigInteger P = newBigInteger();
    int carry = 0;
    int temp;
    int set;
    int new;
    int b;
    long sum;
    if(length(B) > length(A)){
        multiply(P,B,A);
        return;
    }
    if(A->sign == -1 && B->sign == 1){
        P->sign = -1;
    }
    else if(A->sign == 1 && B->sign == -1){
        P->sign = -1;
    }
    else{
        P->sign = 1;
    }
    clear(P->nums);
    moveBack(A->nums);
    moveback(B->nums);
    for(int i = 0; i < length(B)*2; i++){
        if(i == 0 || i%2 == 0){
            b = get(B->nums)%10;
        }
        else{
            b = get(B->nums)/10;
        }
        for(int j = 0; j < length(A)*2; j++){
            int a = get(A->nums)%10;
            temp = (b*a) + carry;
            carry = temp/10;
            set = temp%10;
            a = get(A->nums)/10;
            temp = (b*a) + carry;
            carry = temp % 10;
            new = temp/10;
            sum = (new*10) + set;
            prepend(P->nums, sum);
        }
    }
    return P;
};
// Other operations -----------------------------------------------------------
// printBigInteger()
// Prints a base 10 string representation of N to filestream out.
void printBigInteger(FILE* out, BigInteger N){
    if(N->sign == -1){
        fprintf(out, "-");
    }
    printList(out, N->nums);
    fprintf(out, "\n");
    return;
};
