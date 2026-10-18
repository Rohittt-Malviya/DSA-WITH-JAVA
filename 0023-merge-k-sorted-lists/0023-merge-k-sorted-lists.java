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
    public ListNode mergeKLists(ListNode[] lists) {
       ArrayList<ListNode> arr=new ArrayList<>();
       for(ListNode a:lists){
        arr.add(a);
       }
       if(arr.size()==0)return null;
       while(arr.size()!=1 ){
        ListNode b=arr.get(arr.size()-1);
        arr.remove(arr.size()-1);
        ListNode c=arr.get(arr.size()-1);
        arr.remove(arr.size()-1);
        ListNode d=merge(b,c);
        arr.add(d);

       }
       return arr.get(0);
    }
    public ListNode merge(ListNode h1,ListNode h2){
        ListNode i=h1;
        ListNode j=h2;
        ListNode temp=new ListNode(-1);
        ListNode t=temp;
        while(i!=null && j!=null){
            if(i.val<=j.val){
                t.next=i;
                i=i.next;
            }else{
                t.next=j;
                j=j.next;
            }
            t=t.next;
        }
        if(i==null)t.next=j;
        else t.next=i;
        return temp.next;
    }
}