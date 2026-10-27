class Solution {
    public String firstPalindrome(String[] words) {
       
        for(int i=0;i<words.length;i++){
            String s=words[i];
            int l=0;
            int r=s.length()-1;
            boolean palindrome=true;
            while(l<=r){
                char ch=s.charAt(l);
                char ch1=s.charAt(r);
                if(ch!=ch1){
                   palindrome=false;
                   break;
                }
                l++;
                r--;
                

            }
            if(palindrome)return s;
        }return "";
    }
}