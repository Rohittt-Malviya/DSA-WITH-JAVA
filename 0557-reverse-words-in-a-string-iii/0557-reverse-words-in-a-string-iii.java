class Solution {
    public String reverseWords(String s) {
        String[] word=s.split(" ");
        StringBuilder sb=new StringBuilder();
        for(int i=0;i<word.length;i++){
            word[i]=reverse(word[i]);
            sb.append(word[i]);
            if(i<word.length-1){
                sb.append(" ");
            }
        }
        return sb.toString();
    }

    
    public String reverse(String r){
        String f="";
        for(int i=r.length()-1;i>=0;i--){
            char ch=r.charAt(i);
            f=f+ch;
        }
        return f;
    }
}