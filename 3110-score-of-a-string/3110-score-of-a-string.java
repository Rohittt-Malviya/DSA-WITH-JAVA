class Solution {
    public int scoreOfString(String s) {
        int ans=0;
        for(int i=0;i<s.length()-1;i++){
            char ch=s.charAt(i);
             char ch2=s.charAt(i+1);
            int prev=(int)ch;
            int curr=(int) ch2;
             ans=ans+Math.abs((prev-curr));

        }return ans;
    }
}