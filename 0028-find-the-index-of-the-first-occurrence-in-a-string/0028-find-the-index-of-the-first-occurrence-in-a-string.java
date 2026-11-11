class Solution {
    public int strStr(String haystack, String needle) {
        String s="";
        if(needle.length()>haystack.length())return -1;
        if(needle.length()==haystack.length() && haystack.equals(needle))return 0;
        for(int i=0;i<=haystack.length()-needle.length();i++){
            char ch=haystack.charAt(i);
            char ch2=needle.charAt(0);
            if(ch==ch2){
                s=haystack.substring(i,i+needle.length());
            
         if(s.equals(needle)){
                return i;
            }
            }

            
        }return -1;
        
    }
}