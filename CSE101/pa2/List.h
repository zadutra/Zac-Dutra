//-----------------------------------------------------------------------------
// List.h
// Zachary Dutra
// zdutra
// 1581789
// pa2
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
int front(List L);

// Length()
// Returns the length of L.
int length(List L);

// index()
// Returns current List index
int index(List L);

// get()
// Returns value at List element
int get(List L);

//back()
//Returns value at the back of the List
int back(List L);

//isEmpty()
//returns true(1) if Q is empty, otherwise returns false(0)
int isEmpty(List L);
// Manipulation procedures ----------------------------------------------------

//clear()
//resets input list on initial values
void clear(List L);

// append()
// Places new data element at the end of L
void append(List L, int data);

//prepend()
// places new data element at the beginning lf L
void prepend(List L, int data);

//moveFront()
// moves cursor to the front
void moveFront(List L);

//moveBack()
//moves cursor to the back
void moveBack(List L);

//movePrev()
//moves cursor to previous element
void movePrev(List L);

//moveNext()
//moves cursor to next element
void moveNext(List L);

// deleteFront()
// Deletes element at front of L
// Pre: !isEmpty(L)
void deleteFront(List L);

// deleteBack()
// Deletes element at back of L
// Pre: !isEmpty(L)
void deleteBack(List L);

//delete()
//deletes current cursor node
void delete(List L);

//deleteNext()
//deletes element after the cursor
void deleteNext(List L);

//insertBefore()
//inserts new element before the cursor
void insertBefore(List L, int data);

//insertAfter()
//insert new element after the cursor
void insertAfter(List L, int data);

// Other Functions ------------------------------------------------------------

// printList()
// Prints data elements in L on a single line to stdout.
void printList(FILE* out, List L);

//copyList()
//returns a new list and copies input list to new list
List copyList(List L);

#endif
