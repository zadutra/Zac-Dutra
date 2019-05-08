/*
    Zachary Dutra
    zdutra
    1581789
    pa3
*/

import java.util.*;
import java.io.*;
class Sparse{
public static void main(String[]args)throws IOException{
    PrintWriter out;
    Scanner in;
    String line;
    int lineNumber = 0;
    int mSize;
    int A_NNZ;
    int B_NNZ;
    int row, column;
    double data;
    if(args.length < 2){
        System.err.println("Usage: FileIO infile outfile");
        System.exit(1);
    }
    FileReader fr = new FileReader(args[0]);
    in = new Scanner(new File(args[0]));
    FileWriter output = new FileWriter(new File(args[1]));
    out = new PrintWriter(output);

    mSize = in.nextInt();

    Matrix A = new Matrix(mSize);
    Matrix B = new Matrix(mSize);

    A_NNZ = in.nextInt();
    B_NNZ = in.nextInt();
    for(int i = 0; i < A_NNZ; i++){
        row = in.nextInt();
        column = in.nextInt();
        data = in.nextDouble();
        A.changeEntry(row, column, data);
    }
    line = in.nextLine();
    for(int i = 0; i < B_NNZ; i++){
        row = in.nextInt();
        column = in.nextInt();
        data = in.nextDouble();
        B.changeEntry(row, column, data);
    }
    out.println("A has " + A_NNZ + " non-zero entries:");
    out.println(A);

    out.println("B has " + B_NNZ + " non-zero entries:");
    out.println(B);

    out.println("(1.5)*A =");
    out.println(A.scalarMult(1.5));

    out.println("A+B =");
    out.println(A.add(B));

    out.println("A+A =");
    out.println(A.add(A));

    out.println("B-A =");
    out.println(B.sub(A));

    out.println("A-A =");
    out.println(A.sub(A));

    out.println("Transpose(A) =");
    out.println(A.transpose());

    out.println("A*B =");
    out.println(A.mult(B));

    out.println("B*B =");
    out.print(B.mult(B));

    in.close();
    output.close();
    out.close();
}
}