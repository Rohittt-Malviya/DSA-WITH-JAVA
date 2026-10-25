class Solution {
    public int finalValueAfterOperations(String[] operations) {
        int count=0;
        for(int i=0;i<operations.length;i++){
           // char ch=opeartions[i];
            if(operations[i].equals("++X")|| operations[i].equals("X++")){
                count++;
            }else{
                count--;
            }
        }
        // if(count<0){
        //     return 0;
        // }
        return count;
    }
}