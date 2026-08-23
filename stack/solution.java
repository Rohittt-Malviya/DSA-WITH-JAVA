package Stack;

import java.util.Stack;

public class basic {
    static void main(String[] args) {
        Stack<Integer> s= new Stack<>();
        s.push(1000);
        s.push(100);
        s.push(10);
        System.out.println(s.peek());// peek is used to see the top element
        System.out.println(s.pop());// pop is used to see delete the LIFO element
        System.out.println(s);
        System.out.println(s.empty());// empty is used to check the stack
    }
}
