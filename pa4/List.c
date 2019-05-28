//-----------------------------------------------------------------------------
// List.c
// Zachary Dutra
// zdutra
// 1581789
// pa2
//-----------------------------------------------------------------------------

#include<stdio.h>
#include<stdlib.h>
#include "List.h"

// structs --------------------------------------------------------------------

// private NodeObj type
typedef struct NodeObj{
   int data;
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


// Constructors-Destructors ---------------------------------------------------

// newNode()
// Returns reference to new Node object. Initializes next and data fields.
// Private.
Node newNode(int data){
   Node N = malloc(sizeof(NodeObj));
   N->data = data;
   N->next = NULL;
   return(N);
}

// freeNode()
// Frees heap memory pointed to by *pN, sets *pN to NULL.
// Private.
void freeNode(Node* pN){
   if( pN!=NULL && *pN!=NULL ){
      free(*pN);
      *pN = NULL;
   }
}

// newList()
// Returns reference to new empty List object.
List newList(void){
   List L;
   L = malloc(sizeof(ListObj));
   L->front = L->back = L->cursor = NULL;
   L->length = 0;
   L->index = -1;
   return(L);
}


// freeList()
// Frees all heap memory associated with List *pL, and sets *pL to NULL.S
void freeList(List* pL){
   if(pL!=NULL && *pL!=NULL) { 
      while( !isEmpty(*pL) ) { 
         deleteFront(*pL); 
      }
      free(*pL);
      *pL = NULL;
   }
}


// Access functions -----------------------------------------------------------

// getFront()
// Returns the value at the front of L.
// Pre: !isEmpty(L)
int front(List L){
   if( L == NULL ){
      printf("List Error: calling front() on NULL List reference\n");
      exit(1);
   }
   if( isEmpty(L) ){
      printf("List Error: calling front() on empty List reference\n");
      exit(1);
   }
   return(L->front->data);
}

//back()
//Returns value at the back of the List
int back(List L){
   if( L == NULL ){
      printf("List Error: calling back() on NULL List reference\n");
      exit(1);
   }
   if( isEmpty(L) ){
      printf("List Error: calling back() on empty List reference\n");
      exit(1);
   }
   return(L->back->data);
}

// Length()
// Returns the length of L.
int length(List L){
   if( L==NULL ){
      printf("List Error: calling length() on NULL List reference\n");
      exit(1);
   }
   if( isEmpty(L) ){
      return 0;
   }
   return(L->length);
}

//index()
//Returns current List index
int index (List L){
   if( L==NULL ){
      printf("List Error: calling index() on NULL List reference\n");
      exit(1);
   }
   if( isEmpty(L) ){
      return -1;
   }
      return (L->index);
}

// get()
// returns data at current cursor node
int get(List L){
   if( L==NULL ){
      printf("List Error: calling get() on NULL List reference\n");
      exit(1);
   }
   else if( L->cursor == NULL){
      return -1;
   }
   return (L->cursor->data);
}
// equals()
// returns true (1) if A is identical to B, false (0) otherwise
int equals(List A, List B){
   int eq = 0;
   Node N = NULL;
   Node M = NULL;

   if( A==NULL || B==NULL ){
      printf("List Error: calling equals() on NULL List reference\n");
      exit(1);
   }

   eq = ( A->length == B->length );
   N = A->front;
   M = B->front;
   while( eq && N!=NULL){
      eq = (N->data==M->data);
      N = N->next;
      M = M->next;
   }
   return eq;
}

// isEmpty()
// Returns true (1) if Q is empty, otherwise returns false (0)
int isEmpty(List L){
   if( L==NULL ){
      printf("List Error: calling isEmpty() on NULL List reference\n");
      exit(1);
   }
   return(L->length==0);
}


// Manipulation procedures ----------------------------------------------------

//clear()
//resets input list on initial values
void clear(List L){
   L->front = L->back = L->cursor= NULL;
   L->index = -1;
   L->length = 0;
   return;
}

// append()
// Places new data element at the end of L
void append(List L, int data)
{
   Node N = newNode(data);

   if( L==NULL ){
      printf("List Error: calling Enqueue() on NULL List reference\n");
      exit(1);
   }
   if( isEmpty(L) ) { 
      L->front = L->back = N; 
   }else{ 
      L->back->next = N; 
      L->back = N; 
   }
   L->length++;
   return;
}

// prepend()
// Places new data element at the beginning of L
void prepend(List L, int data)
{
   Node N = newNode(data);

   if( L==NULL ){
      printf("List Error: calling Enqueue() on NULL List reference\n");
      exit(1);
   }
   if( isEmpty(L) ) { 
      L->front = L->back = N; 
   }else{ 
      N->next = L->front;
      L->front = N; 
   }
   L->length++;
   if(L->index != -1){
      L->index++;
   }
   return;
}
//moveFront()
// moves cursor to the front
void moveFront(List L){
   if(L->length==0){
      return;
   }
   else{
      L->cursor = L->front;
      L->index = 0;
      return;
   }
}

//moveBack()
//moves cursor to the back
void moveBack(List L){
   if(L->length==0){
      return;
   }
   else{
      L->cursor = L->back;
      L->index = L->length - 1;
      return;
   }
}

//movePrev()
//moves cursor to previous element
void movePrev(List L){
   if(L->cursor == L->front){
      L->cursor = NULL;
      L->index = -1;
      return;
   }
   else{
      Node N = L->front;
      while(N->next != L->cursor){
         N = N->next;
      }
      L->cursor = N;
      L->index--;
      return;
   }
}

//moveNext()
//moves cursor to next element
void moveNext(List L){
   if(L->cursor == L->back){
      L->cursor = NULL;
      L->index = -1;
      return;
   }
   else{
      L->cursor = L->cursor->next;
      L->index++;
      return;
   }
}

//insertBefore()
//inserts new element before the cursor
void insertBefore(List L, int data){
   if(L->length == 0 || L->cursor == L->front){
      prepend(L, data);
      return;
   }
   else if (L->cursor == NULL) {
      return;
   }
   else{
      Node N = newNode(data);
      Node temp = L->front;
      while(temp->next != L->cursor){
         temp = temp->next;
      }
      temp->next = N;
      N->next = L->cursor;
      L->length++;
      L->index++;
      return;
   }
}

//insertAfter()
//insert new element after the cursor
void insertAfter(List L, int data){
   if(L->length == 0){
      prepend(L, data);
      return;
   }
   else if(L->cursor == L->back){
      append(L, data);
      return;
   }
   else if (L->cursor == NULL) {
      return;
   }
   else{
      Node N = newNode(data);
      N->next = L->cursor->next;
      L->cursor->next = N;
      L->length++;
      return;
   }
}
// deleteFront()
// Deletes element at front of L
// Pre: !isEmpty(L)
void deleteFront(List L){
   Node N = NULL;
   if( L==NULL ){
      printf("List Error: calling deleteFront() on NULL List reference\n");
      exit(1);
   }
   if( isEmpty(L) ){
      printf("List Error: calling deleteFront() on an empty List\n");
      exit(1);
   }
   if(L->cursor == L->front){
      L->cursor = NULL;
      L->index = -1;
   }
   N = L->front;
   if( length(L)>1 ) { 
      L->front = L->front->next; 
   }
   else{ 
      L->front = L->back = NULL; 
   }
   L->length--;
   if(L->index != -1){
      L->index--;
   }
   freeNode(&N);
   return;
}

// deleteBack()
// Deletes element at back of L
// Pre: !isEmpty(L)
void deleteBack(List L){
   Node N = L->front;

   if( L==NULL ){
      printf("List Error: calling deleteBack() on NULL List reference\n");
      exit(1);
   }
   if( isEmpty(L) ){
      printf("List Error: calling deleteBack() on an empty List\n");
      exit(1);
   }
   if(L->cursor == L->back){
      L->cursor = NULL;
      L->index = -1;
   }
   if( length(L)>1 ) { 
      while(N->next != L->back){
         N = N->next;
      }
      N->next = NULL;
      L->back = N;
      L->length--;
      freeNode(&N);
      return;
   }
   else{ 
      L->front = L->back = NULL; 
       L->length--;
      freeNode(&N);
      return;
   }
}

//delete()
//deletes current cursor node
void delete(List L){
      if(L->cursor==NULL){
         return;
      }
      if(L->cursor == L->front){
         deleteFront(L);
         return;
      }
      if(L->cursor == L->back){
         deleteBack(L);
         return;
      }
      else{
         Node N = L->front;
         while(N->next != L->cursor){
            N = N-> next;
         }
         N->next = L->cursor->next;
         L->cursor = NULL;
         L->index = -1;
         L->length--;
         return;
      }
}


// Other Functions ------------------------------------------------------------

// printList()
// Prints data elements in L on a single line to out.
void printList(FILE* out, List L){
   Node N = NULL;

   if( L==NULL ){
      printf("List Error: calling printList() on NULL List reference\n");
      exit(1);
   }

   for(N = L->front; N != NULL; N = N->next){
      fprintf(out, "%d ", N->data);
   }
   fprintf(out, "\n");
}

//copyList()
//returns a new list and copies input list to new list
List copyList(List L){
   List new_list = newList();
   new_list->front = L->front;
   Node temp = L->front;
   Node newTemp = new_list->front;
   new_list->length = L->length;
   while(temp != NULL){
      temp = temp->next;
      newTemp->next = temp;
      newTemp = newTemp->next;
   }
   return new_list;
}
