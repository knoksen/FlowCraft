
'use client';

import { useWorkflowStore } from './workflowStore';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const jsonStringOrObject = z.union([
  z.string().refine((val) => {
    if (!val || val.trim() === '') return true;
    try {
      JSON.parse(val);
      return true;
    } catch {
      return false;
    }
  }, { message: 'Headers must be valid JSON.' }),
  z.record(z.any())
]).optional();


const httpConfigSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE']),
  headers: jsonStringOrObject,
  body: jsonStringOrObject,
});

const localCommandConfigSchema = z.object({
  command: z.string().min(1, { message: 'Command cannot be empty.' }),
  args: z.string().optional(),
  executor: z.string().min(1, {message: 'Please define an executor for this command.'}),
});

const formSchemas = {
  http: httpConfigSchema,
  local_command: localCommandConfigSchema,
  placeholder: z.object({}),
  trigger: z.object({}),
  action: z.object({}),
  delay: z.object({}),
};

const HttpConfigForm = () => {
  const form = useFormContext();
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>URL</FormLabel>
            <FormControl>
              <Input placeholder="https://api.example.com/data" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="method"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Method</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a method" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="headers"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Headers (JSON)</FormLabel>
            <FormControl>
              <Textarea placeholder='{ "Content-Type": "application/json" }' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="body"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Body (JSON)</FormLabel>
            <FormControl>
              <Textarea placeholder='{ "key": "value" }' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

const LocalCommandConfigForm = () => {
    const form = useFormContext();
    return (
        <div className="space-y-4">
            <FormField
                control={form.control}
                name="command"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Command</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., /usr/bin/python" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="args"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Arguments (comma-separated)</FormLabel>
                        <FormControl>
                            <Input placeholder="script.py, --verbose" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="executor"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Executor</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g, powershell, /user/bin/zsh" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
};

export function NodeConfigModal() {
  const { nodes, selectedNodeId, selectNode, updateNodeConfig } = useWorkflowStore();
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const currentSchema = selectedNode ? formSchemas[selectedNode.type] : z.object({});

  // Prepare initial values: if headers or body are objects, stringify them for the form
  const initialConfig = selectedNode?.config ? {
    ...selectedNode.config,
    headers: typeof selectedNode.config.headers === 'object' ? JSON.stringify(selectedNode.config.headers, null, 2) : selectedNode.config.headers,
    body: typeof selectedNode.config.body === 'object' ? JSON.stringify(selectedNode.config.body, null, 2) : selectedNode.config.body,
    args: Array.isArray(selectedNode.config.args) ? selectedNode.config.args.join(', ') : selectedNode.config.args,
  } : {};


  const form = useForm({
    resolver: zodResolver(currentSchema),
    values: initialConfig,
    resetOptions: {
      keepValues: false,
    }
  });

  const onSubmit = (data: any) => {
    if (!selectedNodeId) return;
    
    let processedData = {...data};

    // Attempt to parse headers and body if they exist and are strings
    if (processedData.headers && typeof processedData.headers === 'string') {
        try {
            processedData.headers = JSON.parse(processedData.headers);
        } catch (e) {
            // Zod validation should have already caught this, but for safety:
            form.setError('headers', { type: 'manual', message: 'Invalid JSON format.'});
            return;
        }
    }
    if (processedData.body && typeof processedData.body === 'string') {
        try {
            processedData.body = JSON.parse(processedData.body);
        } catch (e) {
            form.setError('body', { type: 'manual', message: 'Invalid JSON format.'});
            return;
        }
    }
     if (processedData.args && typeof processedData.args === 'string') {
        processedData.args = processedData.args.split(',').map((arg: string) => arg.trim()).filter(Boolean);
    }

    updateNodeConfig(selectedNodeId, processedData);
    selectNode(null);
  };
  
  const renderForm = () => {
      if (!selectedNode) return null;
      switch(selectedNode.type) {
          case 'http':
              return <HttpConfigForm />;
          case 'local_command':
              return <LocalCommandConfigForm />;
          default:
              return <p className="text-muted-foreground">This step type does not require configuration.</p>;
      }
  }

  return (
    <Sheet open={!!selectedNodeId} onOpenChange={() => selectNode(null)}>
      <SheetContent className="sm:max-w-lg">
        {selectedNode && (
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col">
              <SheetHeader>
                <SheetTitle>Configure: {selectedNode.title}</SheetTitle>
                <SheetDescription>{selectedNode.description}</SheetDescription>
              </SheetHeader>
              <div className="py-6 flex-1 overflow-y-auto pr-6">
                {renderForm()}
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </SheetClose>
                <Button type="submit">Save Changes</Button>
              </SheetFooter>
            </form>
          </FormProvider>
        )}
      </SheetContent>
    </Sheet>
  );
}
