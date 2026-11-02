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
    public ListNode reverseKGroup(ListNode head, int k) {
        ListNode temp=head;
        ListNode temp1=new ListNode(-1);
        ListNode t1=temp1;
        
        while(temp!=null){
            int count=0;
            ListNode c=temp;
            while(count<k && c!=null){
                count++;
                c=c.next;
            }
            ListNode ans=new ListNode(-1);
            ListNode a=ans;
            if(count==k){
                ListNode sa=temp;
            for(int i=1;i<=k;i++){
               a.next=temp;
               temp=temp.next;
               a=a.next;
            }
            a.next=null;
            
            ans=ans.next;
            ans=reverse(ans);
            t1.next=ans;
            
            // for(int i=1;i<k;i++){
            //     t1=t1.next;
            // }
            t1=sa;
            t1.next=c;
            temp=c;
           // t1=t1.next;

            }else{
                t1.next=temp;
                break;
            }

        }return temp1.next;
    }
    public ListNode reverse(ListNode head){
        ListNode prev=null;
        ListNode curr=head;
        ListNode fwd=null;
        while(curr!=null){
            fwd=curr.next;
            curr.next=prev;
            prev=curr;
            curr=fwd;
        }return prev;
    }
}