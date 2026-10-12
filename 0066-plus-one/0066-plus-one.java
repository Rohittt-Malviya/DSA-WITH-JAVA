class Solution {
    public int[] plusOne(int[] arr) {
       //int i=digits.length;
      for(int i=arr.length-1;i>=0;i--){
        if(arr[i]<9){
            arr[i]++;
            return arr;
        }
        else if(arr[i]==9){
            arr[i]=0;
        }
      }
      int[] result=new int[arr.length+1];
      result[0]=1;
       return result;
    }
}