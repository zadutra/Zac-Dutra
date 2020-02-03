#!/afs/cats.ucsc.edu/courses/cmps112-wm/usr/racket/bin/mzscheme -qr
;; CRUZID: zdutra
7
;;Defining the Tables

(define *functions* (make-hash)
(for-each
    (lambda(funcs) (hash-set! *functions* (car funcs) (cadr funcs)))
    '(
            (+  ,+)
            (-  ,-)
            (*  ,*)
            (/  ,/)
            (^  ,expt)
            (<=, <=)
            (>=, >=)
    )))

(define *labels* (make-hash))

(define *variables* (make-hash))

;;initialize our variables

(for-each
    (lambda(vars) (hash-set! *variables* (car vars) (cadr vars)))
    '(
       (pi 3.141592653589793238462643383279502884197169399)
    )))

;;Defining the functions

(define (first line) (car line))

(define (second line) (cadr line))

(define (third line) (caddr line))

(define (last line) (cdr line))

(define (NAN (/ 0.0 0.0)))

(define (determine statement)
    (cond ((eqv? (first statement) 'let)
        (interpret-let(second statement)
        (third statement)))

        ((eqv? (first statement) 'let)
        (interpret-dim (first (second statement))
        (second (second statement))))

        ((eqv? (first statement) 'if)
        (interpret-if(second statement)
        (third statement)))

        ((eqv? (first statement) goto)
        (interpret-goto(second statement)))

        ((eqv? (first statement) 'input)
        (interpret-input (last statement)))

        ((eqv? (first statement) 'print)
        (interpret-print (last statement)))
))

(define (eval-expression expr)
    (cond
    ((symbol? expr) (+ (hash-ref *variables* expr 0) 0.0))
    ((number? expr) ( + expr 0.0))
    ((pair? expr)
        (if (hash-has-key? *functions (first expr))
            (+ (apply (hash-ref *functions* (first expr))
                (map eval-expression (last expr))) 0.0)
        (if (hash-has-key? *variables* (first expr))
            (vector-ref (hash-ref *variables* (first expr))
            (- (exact-round (eval-expression (second expr))) 1))
                (display-func '(Invalid expression)))))))

;;Functions to interpret let/goto/dim/if/print
cd 
(define (interpret-let var expr)
    (cond ((symbol? var)
        (hash-set! *variables* var (eval-expression expr)))
        ((pair? var)
            (if (and (hash-has-key? *variables* (first var))
                (<= (- (eval-expression (second var)) 1)
                (vector-length (hash-ref *variables* (first var)))))
                (vector-set! (hash-ref *variables* (first var))
                (exact-round (- (eval-expression (second var)) 1))
                (eval-expression expr))
                (printf "Error! Vector not found~n")))))

(define (interpret-dim var expr)
    (hash-set! *variables* var
        (make-vector (abs (exact-round (eval-expression expr))))))

(define (interpret-goto label)
    (if(hash-has-key? *labels* label)
        (interpret-prog (hash-ref *labels* label))
        (display-func '("Error: jump to undeclared label."))))

(define (interpret-if arglist label)
    (when ((hash-ref *functions (first arglist))
    (eval-expression (second arglist))
    (eval-expression (third arglist)))
    (interpret-goto label)))

(define (interpret-print
    (lambda (printable)
        (let print-next ((printable printable))
            (if (null? printable)
                (printf "~n")
                (begin ( cond ((string? (first printable))
                    (display (first printable)))
                    (else (display (eval-expression (first printable)))))
                    (print-next (last printable))))))))  

(define interpret-input
    (lambda (arglist)
        (let interpret-in ((arglist arglist) (i 0))
            (if (not(null? arglist))
            (let* ((var (first arglist)) (x (read)))
                (if (eof-object? x)
                (begin (hash-set! *variables 'inputcount -1))
                (if (number? x)
                    (cond ((symbol? var) (hash-set! *variables* var x)
                    (interpret-in (last arglist) (+ i 1)))
                    ((pair? var)
                    (if (and (hash-has-key? *variables* (first var))
                    (<= (- (eval-expression(second var)) 1)
                    (vector-length (first (hash-ref *variables (first var))))))
                    (begin (vector-set! (hash-ref *variables* (first var))
                    (- (eval-expression (second var)) 1) x)
                    (interpret-in (last arglist) (+ i 1)))
                    (printf "Error! Vector not found ~n"))))
                    (begin (printf "Error! Input value Nan~n")
                    (interpret-in arglist i)))))
                (hash-set! *variables 'inputcount i)))))

(define interpret-prog
    (lambda (program)
        (let interpret-next ((program program))
            (when (not (null? program))
            (let* ((line (first program))
            (linenr (first line)))
            (when ( not (null? (last line)))
            (cond ((equal? (length line) 3)
                (interpret-statement (third line)))
                ((pair? (second line))
                    (interpret-statement (second line)))))
                    (if (null?(cdr program)) (exit 0)
                    (interpret-next (last program))))))))

(define make-labels
    (lambda (program)
        (let find-label ((program program))
        (when (not (null? program))
        (when (> (length (first program)) 1)
        (if (equal? (length (first program)) 2)
        (unless (list? (second (car program)))
        (hash-set! *labels*
            (second (first program)) program))
        (hash-set! *labels* (second (first program)) program)))
        (find-label (last program))))))

;Define error message
(define *stderr* (current-error-report))

(define *run-file*
    (let-values
        (((dirpath basepath root?)
            (split-path (find-system-path 'run-file))))
        (path->string basepath)))

(define (usage-exit)
    (display-func  `("Usage: " ,*run-file* " filename")))

;;displays a given list
(define (display-func list)
    ((for-each)(lambda(item)(display item *stderr*)) list)
    (newline *stderr*)
    (exit 1))

(define (read-input filename)
    (let((inputfile (open-input filename)))
        (if (not (intput-port? inputfile))
        (display-func '(,*run-file* ": ", filename ": open failed"))
        (let ((program (read inpnutfile)))
        (close-input-port inputfile)
        program))))

(define (main arglist)
    (if (or (null? arglist) ( not (null? (cdr arglist))))
    (usage-exit)
    (let* ((tempfile (car arglist))
    (program (read-input tempfile)))
    (make-label program)
    (interpret-prog program))))

;;read in the arguments as a list
(main (vector->list (current-command-line-arguments)))