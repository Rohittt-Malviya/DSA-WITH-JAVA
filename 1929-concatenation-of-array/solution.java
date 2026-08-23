class Solution {
    public int[] getConcatenation(int[] nums) {
       
        int[] s=new int[nums.length*2];
        for(int i=0;i<nums.length;i++){
            s[i]=nums[i];
            
                s[i+nums.length]=nums[i];
           
        }
        return s;

    }
}
