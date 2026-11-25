class Solution {
    public int minElement(int[] nums) {
       int min=Integer.MAX_VALUE;
       for(int i=0;i<nums.length;i++){
        int a=nums[i];
        int d=0;
        while(a!=0){
            int s=a%10;
             d=d+s;
             a/=10;
        }
        nums[i]=d;
        d=0;
        min=Math.min(min,nums[i]);
       } return min;
    }
}