class Solution {
    public int triangularSum(int[] nums) {
        int ans=0;
        int n=nums.length;
        if(nums.length==1)return nums[0];
        while(n!=1){
            int[] a=new int[n-1];
            for(int i=0;i<a.length;i++){
            int s=(nums[i]+nums[i+1])%10;
            a[i]=s;}
            nums=a;
            n=n-1;
            //ans=a[0];
        }
        return nums[0];
    }
}