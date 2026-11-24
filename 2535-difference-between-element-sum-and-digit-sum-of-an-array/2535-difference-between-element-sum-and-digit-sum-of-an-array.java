class Solution {
    public int differenceOfSum(int[] nums) {
        int sum=0;
        int sum2=0;
        for(int i=0;i<nums.length;i++){
            sum+=nums[i];
        }for(int i=0;i<nums.length;i++){
       int a=nums[i];
            while(a>0){
                
                int d=a%10;
                sum2=sum2+d;
                a/=10;

            }
           // sum2+=nums[i];
        }return Math.abs(sum-sum2);

    }
}