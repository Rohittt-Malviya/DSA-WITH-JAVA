class Solution {
    public int findGCD(int[] nums) {
        int min=nums[0];
        int max=nums[0];
       //Arrays.sort(nums);
       for(int i=0;i<nums.length;i++){
        if(nums[i]<min){
            min=nums[i];
        }else if(nums[i]>max){
          max=nums[i];
        }
       }
       // min=nums[0];
       // max=nums[nums.length-1];
        return gcd(min,max);

    }
    public int gcd(int a,int b){
        if(a==0){
            return b;
        }return gcd(b%a,a);
    }
}