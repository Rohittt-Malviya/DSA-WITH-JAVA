/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public int[][] spiralMatrix(int m, int n, ListNode head) {
        int[][] matrix=new int[m][n];
        int fr=0;
        for(int[]row:matrix) {
             Arrays.fill(row, -1);
}
        ListNode temp=head;
        int fc=0;
        int lr=matrix.length-1;
        int lc=matrix[0].length-1;
        while(temp!=null && fr<=lr && fc<=lc ){
            for(int i=fc;i<=lc && temp!=null;i++){
                matrix[fr][i]=temp.val;
                temp=temp.next;
            }fr++;
            for(int i=fr;i<=lr &&temp!=null ;i++){
                matrix[i][lc]=temp.val;
                temp=temp.next;
            }lc--;
            if(fr<=lr){
            for(int i=lc;i>=fc && temp!=null;i--){
                matrix[lr][i]=temp.val;
                temp=temp.next;
            }lr--;
            }
            if(fc<=lc){
                for(int i=lr;i>=fr &&temp!=null;i--){
                    matrix[i][fc]=temp.val;
                    temp=temp.next;
                }fc++;
            }
        }return matrix;
    }
}