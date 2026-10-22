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
    public ListNode mergeNodes(ListNode head) {
        //ArrayList<ListNode> ans=new ArrayList<>();
        ListNode temp=head;
        int sum=0;
        ListNode dummy=new ListNode(-1);
        ListNode ans=dummy;

        while(temp!=null){
           
           if(temp.val!=0){
            sum=sum+temp.val;

           }else{
            if(sum!=0){
            //ans.add(sum);
            ListNode an=new ListNode(sum);
            ans.next=an;
            ans=ans.next;}
            sum=0;
           }
           temp=temp.next;
           
        }
        return dummy.next;
    }
}