class Solution {
    public int[] applyOperations(int[] nums) {
        int in=0;
        for(int i=0;i<nums.length-1;i++){
            if(nums[in]==nums[in+1]){
                nums[in]=nums[in]*2;
                nums[in+1]=0;
                in++;
            }
            else{
               in++;
            }
            

        }
        int a=0;
        for(int i=0;i<nums.length;i++){
            if(nums[i]!=0){
                int temp=nums[i];
                nums[i]=nums[a];
                nums[a]=temp;
                a++;
            }
        }
        
        
        return nums;
    }
}