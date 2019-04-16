//-----------------------------------------------------------------------------
// List.c
// Zachary Dutra
// zdutra
// 1581789
// pa2
//-----------------------------------------------------------------------------

#include<stdio.h>
#include<stdlib.h>
#include "Queue.h"

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
   int length;
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
   L->front = L->back = NULL;
   L->length = 0;
   return(L);
}


// freeList()
// Frees all heap memory associated with List *pL, and sets *pL to NULL.S
void freeList(List* pL){
   if(pL!=NULL && *pL!=NULL) { 
      while( !isEmpty(*pL) ) { 
         Dequeue(*pL); 
      }
      free(*pL);
      *pL = NULL;
   }
}


// Access functions -----------------------------------------------------------

// getFront()
// Returns the value at the front of L.
// Pre: !isEmpty(L)
int Front(List L){
   if( L == NULL ){
      printf("List Error: calling getFront() on NULL List reference\n");
      exit(1);
   }
   if( isEmpty(ListObj) ){
      printf("List Error: calling getFront() on NULL List reference\n");
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
   if( isEmpty(ListObj) ){
      printf("List Error: calling back() on NULL List reference\n");
      exit(1);
   }
   return(L->back->data);
}

// Length()
// Returns the length of L.
int Length(List L){
   if( L==NULL ){
      printf("List Error: calling getLength() on NULL List reference\n");
      exit(1);
   }
   return(L->length);
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


// Manipulation procedures ----------------------------------------------------

// Enqueue()
// Places new data element at the end of L
void Enqueue(List L, int data)
{
   Node N = newNode(data);

   if( L==NULL ){
      printf("List Error: calling Enqueue() on NULL List reference\n");
      exit(1);
   }
   if( isEmpty(Q) ) { 
      L->front = L->back = N; 
   }else{ 
      L->back->next = N; 
      L->back = N; 
   }
   L->length++;
}

// Dequeue()
// Deletes element at front of L
// Pre: !isEmpty(L)
void Dequeue(List L){
   Node N = NULL;

   if( L==NULL ){
      printf("List Error: calling Dequeue() on NULL List reference\n");
      exit(1);
   }
   if( isEmpty(L) ){
      printf("List Error: calling Dequeue on an empty List\n");
      exit(1);
   }
   N = L->front;
   if( getLength(L)>1 ) { 
      L->front = L->front->next; 
   }else{ 
      L->front = L->back = NULL; 
   }
   L->length--;
   freeNode(&L);
}


// Other Functions ------------------------------------------------------------

// printList()
// Prints data elements in L on a single line to stdout.
void printList(List L){
   Node N = NULL;

   if( L==NULL ){
      printf("List Error: calling printList() on NULL List reference\n");
      exit(1);
   }

   for(N = L->front; N != NULL; N = N->next){
      printf("%d ", N->data);
   }
   printf("\n");
}


