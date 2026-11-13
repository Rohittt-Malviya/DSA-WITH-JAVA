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
    public ListNode[] splitListToParts(ListNode head, int k) {
        ListNode[] ans=new ListNode[k];
        ListNode temp=head;
        int count=0;
        while(temp!=null){
            count++;
            temp=temp.next;
        }
        temp=head;
        int avg=count/k;
        int ex=count%k;
       

for(int i=0;i<k;i++){
 if(temp==null)break;
  int len=0;
  ListNode curr=temp;
ListNode prev=null;
        while(temp!=null && len<avg){
              prev=temp;
              temp=temp.next;
              len++;
        }if(ex>0){
            prev=temp;
            temp=temp.next;
            ex--;
        }
        prev.next=null;
        ans[i]=curr;}
        return ans;
    }
}