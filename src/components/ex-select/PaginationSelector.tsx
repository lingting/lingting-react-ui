import { Empty, Select } from "antd";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { PaginationSelectorProps } from "@lri/types";

const PAGE_SIZE = 20;
const SCROLL_THRESHOLD = 24;

function toSelectedValues(value: string[] | string | undefined) {
  return Array.isArray(value) ? value : value ? [value] : [];
}

function PaginationSelectorComponent<T>({
  debounceDelay = 300,
  filter,
  lazy = false,
  multiple = true,
  onChange,
  props,
  request,
  requestMode = "raw",
  toOption,
  value,
}: PaginationSelectorProps<T>) {
  const [current, setCurrent] = useState(1);
  const [data, setData] = useState<T[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(toSelectedValues(value));
  const dataRef = useRef<T[]>([]);
  const loadingRef = useRef(false);
  const requestIdRef = useRef(0);
  const requestRef = useRef(request);
  const requestModeRef = useRef(requestMode);
  const totalRef = useRef(0);

  useEffect(() => {
    requestRef.current = request;
    requestModeRef.current = requestMode;
  }, [request, requestMode]);

  const loadPage = useCallback(async (page: number, nextInput?: string) => {
    if (page > 1 && (loadingRef.current || dataRef.current.length >= totalRef.current)) {
      return;
    }

    loadingRef.current = true;
    setLoading(true);
    const requestId = ++requestIdRef.current;
    try {
      const result = await requestRef.current(
        { current: page, size: PAGE_SIZE, sorts: [] },
        requestModeRef.current === "filter" ? nextInput || undefined : undefined,
      );
      if (requestId !== requestIdRef.current) {
        return;
      }

      const nextData = page === 1 ? result.records : [...dataRef.current, ...result.records];
      dataRef.current = nextData;
      totalRef.current = result.total;
      setCurrent(page);
      setData(nextData);
    } catch {
      if (requestId === requestIdRef.current) {
        dataRef.current = [];
        totalRef.current = 0;
        setCurrent(1);
        setData([]);
      }
    } finally {
      if (requestId === requestIdRef.current) {
        loadingRef.current = false;
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    setSelectedValues(toSelectedValues(value));
  }, [value]);

  useEffect(() => {
    if (!lazy) {
      void loadPage(1);
    }
  }, [lazy, loadPage]);

  useEffect(() => {
    if (requestMode !== "filter" || !input) {
      return;
    }

    const timer = window.setTimeout(() => {
      void loadPage(1, input);
    }, debounceDelay);
    return () => window.clearTimeout(timer);
  }, [debounceDelay, input, loadPage, requestMode]);

  const options = useMemo(() => {
    const filteredData = filter
      ? filter(data, input)
      : requestMode === "raw"
        ? data.filter((item) => String(toOption(item)?.label).includes(input))
        : data;

    return filteredData.flatMap((item) => {
      const option = toOption(item);
      return option ? [option] : [];
    });
  }, [data, filter, input, requestMode, toOption]);

  const handleChange = (nextValue: string[]) => {
    const nextValues = multiple ? nextValue : nextValue.slice(0, 1);
    setSelectedValues(nextValues);
    onChange?.(multiple ? nextValues : nextValues[0]);
  };

  return (
    <Select
      {...props}
      style={props?.style || { width: "100%" }}
      allowClear
      loading={loading}
      maxCount={multiple ? undefined : 1}
      mode="multiple"
      notFoundContent={loading ? undefined : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
      options={options}
      value={selectedValues}
      onChange={handleChange}
      onOpenChange={(open) => {
        props?.onOpenChange?.(open);
        if (open && !data.length) {
          void loadPage(1);
        }
      }}
      onPopupScroll={(event) => {
        props?.onPopupScroll?.(event);
        const target = event.currentTarget;
        if (target.scrollTop + target.clientHeight >= target.scrollHeight - SCROLL_THRESHOLD) {
          void loadPage(current + 1, input);
        }
      }}
      showSearch={{
        filterOption: false,
        onSearch: setInput,
      }}
    />
  );
}

export const PaginationSelector = memo(
  PaginationSelectorComponent,
) as typeof PaginationSelectorComponent;
