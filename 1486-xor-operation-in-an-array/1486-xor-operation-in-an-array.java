class Solution {
    public int xorOperation(int n, int start) {
        int[] a=new int[n];
        int ans=0;
        for(int i=0;i<a.length;i++){
            a[i]=start+2*i;
            ans=ans^a[i];
        }return ans ;
    }
}