/*
    Zachary Dutra
    zdutra
    1581789
    pa3
*/
class MatrixTest{
    public static void main(String [] args){
        Matrix A = new Matrix(10);
        Matrix B = new Matrix(15);
        A.changeEntry(1, 1, 1);
        B.changeEntry(1, 1, 1);
        System.out.println(A.equals(B));
        B = new Matrix(10);
        A.changeEntry(1, 1, 1);
        A.changeEntry(1, 3, 1);
        B.changeEntry(1, 1, 1);
        B.changeEntry(1, 3, 1);
        System.out.print(A.toString());
        System.out.print(B.toString());
        System.out.println(A.equals(B));
        System.out.println(!A.equals(B));
        A.changeEntry(1, 3, 0);
        System.out.println(A.equals(B));
        A.changeEntry(1, 1, 0);
        B.makeZero();
        A.changeEntry(10, 10, 10);
        B.changeEntry(10, 10, 10);
        System.out.println(!A.equals(B));
        A = new Matrix(100);
        B = new Matrix(100);
        int valcount = 1;
        for (int j = 1; j <= 100; j++) {
          for (int k = 1; k <= 100; k++) {
            // hint: this is 1-10000 left-to-right row-by-row
            A.changeEntry(j, k, valcount++);
          }
          B.changeEntry(j, j, 1); // hint: this is the identity matrix
        }
        Matrix C = A.scalarMult(2);
        System.out.println(!C.equals(A.add(A)));
        C = A.scalarMult(-2);
        System.out.println(!C.equals(A.sub(A).sub(A).sub(A)));
        C = A.mult(B);
        System.out.println(!C.equals(A));
    }
}