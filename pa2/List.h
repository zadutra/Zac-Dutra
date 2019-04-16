//-----------------------------------------------------------------------------
// List.h
// Header file for List ADT
//-----------------------------------------------------------------------------

#ifndef _List_H_INCLUDE_
#define _List_H_INCLUDE_


// Exported type --------------------------------------------------------------
typedef struct ListObj* List;


// Constructors-Destructors ---------------------------------------------------

// newList()
// Returns reference to new empty List object. 
List newList(void);

// freeList()
// Frees all heap memory associated with List *pL, and sets *pL to NULL.
void freeList(List* pL);


// Access functions -----------------------------------------------------------

// Front()
// Returns the value at the front of L.
// Pre: !isEmpty(Q)
int Front(List L);

// Length()
// Returns the length of L.
int Length(List L);

// index()
// Returns current List index
int index(List L);

// get()
// Returns value at List element
int get(List L);

//back()
//Returns value at the back of the List
int back(List L);

// equals()
// returns true (1) if A is identical to B, false (0) otherwise
int equals(List A, List B);

// Manipulation procedures ----------------------------------------------------

// Enqueue()
// Places new data element at the end of L
void Enqueue(List L, int data);

// Dequeue()
// Deletes element at front of Q
// Pre: !isEmpty(Q)
void Dequeue(List L);


// Other Functions ------------------------------------------------------------

// printList()
// Prints data elements in L on a single line to stdout.
void printList(List L);

#endif
