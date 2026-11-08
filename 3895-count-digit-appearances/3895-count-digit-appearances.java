class Solution {
    public int countDigitOccurrences(int[] nums, int digit) {
        StringBuilder s=new StringBuilder();
        int count=0;
        for(int i=0;i<nums.length;i++){
            s.append(nums[i]);
        }
        String g=s.toString();
        for(int i=0;i<g.length();i++){
            char ch=g.charAt(i);
            if(ch==(char)('0'+digit)){
                count++;
            }
        }return count;
    }
}