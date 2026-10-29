class Solution {
    public int reverseDegree(String s) {
        int count=1;
        int sub=123;
        int ans=0;
        for(int i=0;i<s.length();i++){
            char ch=s.charAt(i);
            int ascii=(int) ch;
            int sum=count*(sub-ascii);
            ans=ans+sum;
            count++;
            //sub--;
        }return ans;
    }
}