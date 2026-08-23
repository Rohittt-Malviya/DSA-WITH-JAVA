package search;

public class charlinear {
    static void main(String[] args) {
        String sh="Ram";
        char ch='a';
        System.out.print(search(sh,ch));

    }
    static boolean search(String s,char ch){
        if(s.length()==0){
            return false;
        }
        for(int i=0;i<s.length();i++){
            if(ch == s.charAt(i)){
                return true;

            }
        }
        return false;
    }
}
