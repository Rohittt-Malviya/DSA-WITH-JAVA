class Solution {
    public int removeElement(int[] nums, int val) {
        int count=0;
        for(int j=0;j<nums.length;j++){
           if(nums[j]!=val){
            nums[count]=nums[j];
            count++;
           }
        }
       
        // for(int i=0;i<nums.length;i++){
        //     if(nums[i]>0){
        //         count++;
        //     }
        // }
        return count;

    }
}