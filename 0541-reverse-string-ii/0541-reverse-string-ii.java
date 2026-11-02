class Solution {
    public String reverseStr(String s, int k) {
        char[] ch=s.toCharArray();
        for(int i=0;i<ch.length;i+=2*k){
            int left=i;
            int right=Math.min(i+k-1,ch.length-1);
            while(left<right){
                char a=ch[left];
                ch[left++]=ch[right];
                ch[right--]=a;
            }
        }return new String(ch);
    }
}