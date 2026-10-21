/*
// Definition for a Node.
class Node {
    public int val;
    public Node prev;
    public Node next;
    public Node child;
};
*/

class Solution {
    public Node flatten(Node head) {
        Node temp=head;
        if(head==null)return head;
        while(temp!=null){
            if(temp.child==null)temp=temp.next;
            else{
                Node fwd=temp.next;
                Node c=flatten(temp.child);
                temp.child=null;
                temp.next=c;
                c.prev=temp;
                //Node f=c;
                while(c.next!=null)c=c.next;
                c.next=fwd;
               if(fwd!=null) fwd.prev=c;
                temp=fwd;
            }
        }return head;
    }
}