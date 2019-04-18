<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('物品名称')" v-model="listQuery.name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.cate" style="width: 140px" class="filter-item" placeholder="全部" @change="handleFilter">
        <el-option v-for="cate in cateOptions" :value="cate.id" :label="cate.name" :key="cate.id" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange">
      <el-table-column v-if="false" :label="$t('物品ID')" prop="id" sortable="custom" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.date')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createdTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('物品名称')" min-width="50px">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.name }}</span>
          <!--<el-tag>{{ scope.row.name | typeFilter }}</el-tag>-->
        </template>
      </el-table-column>
      <el-table-column :label="$t('物品类别')" width="110px" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.cate }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('发布者')" width="110px" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('所属学校')" width="110px" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.school }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('标题')" width="110px" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('价格')" width="110px" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['admin']" type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">

      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('table.date')" prop="createdTime">
          <el-date-picker v-model="temp.createdTime" type="datetime" placeholder="Please pick a date"/>
        </el-form-item>
        <el-form-item :label="$t('物品名称')" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item :label="$t('物品类别')" prop="cate">
          <el-select v-model="temp.cateId">
            <el-option v-for="cate in cateOptions" :value="cate.id" :label="cate.name" :key="cate.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogStatus!='create'" :label="$t('发布者')" prop="username">
          <el-input v-model="temp.username"/>
        </el-form-item>
        <el-form-item :label="$t('所属学校')" prop="school">
          <el-input v-model="temp.school"/>
        </el-form-item>
        <el-form-item :label="$t('标题')" prop="username">
          <el-input v-model="temp.title"/>
        </el-form-item>
        <el-form-item :label="$t('物品描述')" prop="description">
          <el-input v-model="temp.description"/>
        </el-form-item>
        <el-form-item :label="$t('物品价格')" prop="price">
          <el-input v-model="temp.price"/>
        </el-form-item>
        <el-form-item :label="$t('几成新')" prop="newLevel">
          <el-input v-model="temp.newLevel"/>
        </el-form-item>
        <el-form-item :label="$t('是否议价')" prop="bahrain">
          <el-select v-model="temp.bahrain">
            <el-option
              v-for="item in bahrainOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('详细地址')" prop="address">
          <el-input v-model="temp.address"/>
        </el-form-item>
        <!--<el-form-item :label="$t('更新时间')" prop="updateTime">-->
        <!--<el-input v-model="temp.updateTime"/>-->
        <!--</el-form-item>-->
        <el-form-item :label="$t('物品图片')" prop="pic">
          <el-input disabled value="点击图片进行删除"/>
          <!--<el-button type="primary" icon="upload" style="position: absolute;bottom: 0px;margin-left: 340px;" @click="imagecropperShow=true">上传图片-->
          <el-button type="primary" icon="upload" style="position: absolute;bottom: 0px;margin-left: 340px;" @click="imagecropperShow=true">上传图片
          </el-button>
          <image-cropper
            v-show="imagecropperShow"
            :width="300"
            :height="300"
            :key="imagecropperKey"
            url="/shop/file/image"
            field="file"
            lang-type="en"
            @close="close"
            @crop-upload-success="cropSuccess"/>
        </el-form-item>
        <el-form-item>
          <img v-for="item in temp.images" :src="item.picUrl" width="100px" height="100px" style="margin-right: 10px" @click="deletePic(item)">
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"/>
        <el-table-column prop="pv" label="Pv"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { deleteProductPic, createProductPic, fetchList, fetchPv, createProduct, updateProduct, deleteProduct } from '@/api/product'
import { getAll } from '@/api/cate'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数
import PanThumb from '@/components/PanThumb'
import ImageCropper from '@/components/ImageCropper'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'UserManager',
  components: { Pagination, PanThumb, ImageCropper },
  directives: { waves, permission },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        cate: undefined,
        type: undefined
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      statusOptions: ['published', 'draft', 'deleted'],
      // roleOptions: ['超级管理员', '管理员'],
      showReviewer: false,
      temp: {
        id: undefined,
        name: '',
        cateId: '',
        cate: '',
        userId: 1,
        username: '',
        school: '',
        description: '',
        title: '',
        newLevel: '',
        bahrain: '',
        price: '',
        address: '',
        createdTime: undefined,
        updateTime: undefined,
        images: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        createdTime: [{ type: 'date', required: true, message: 'createdTime is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      imagecropperShow: false,
      imagecropperKey: 0,

      // 图片对下
      image: {
        id: undefined,
        picUrl: '',
        productId: ''
      },
      bahrainOptions: [
        { value: 1, label: '是' },
        { value: 0, label: '否' }
      ],
      cateOptions: []
    }
  },
  created() {
    this.getAllCate()
    this.getList()
  },
  methods: {
    checkPermission,
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        const data = response.data.data
        // const data = response.data
        this.list = data.records
        this.total = Number(data.total)

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1000)
      })
    },
    getAllCate() {
      getAll().then(response => {
        const data = response.data.data
        this.cateOptions = data.records
        this.cateOptions.push({ id: undefined, name: '全部', url: '' })
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      this.list = this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        cateId: '',
        cate: '',
        userId: '',
        username: '',
        school: '',
        description: '',
        title: '',
        newLevel: '',
        bahrain: '',
        price: '',
        address: '',
        createdTime: undefined,
        updateTime: undefined,
        images: []
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 系统添加默认管理员
          this.temp.userId = 1
          this.temp.username = 'admin'
          createProduct(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateProduct(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      deleteProduct(row.id).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      })
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['createdTime', 'title', 'type', 'importance', 'status']
        const filterVal = ['createdTime', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    cropSuccess(resData) {
      console.log(resData)
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      this.image.picUrl = resData.data
      this.image.productId = this.temp.id
      console.log(this.image)
      // 将图片和物品ID关联保存数据库
      createProductPic(this.image).then(response => {
        const data = response.data.data
        console.log(data)
        this.image.id = data
        this.temp.images.push(this.image)
      })
    },
    close() {
      this.imagecropperShow = false
    },
    deletePic(item) {
      this.$confirm('确定删除？').then(() => {
        console.log('删除图片: ' + item.picUrl)
        // TODO 调用删除图片接口
        deleteProductPic(item.id).then(() => {
          const i = this.temp.images.indexOf(item)
          this.temp.images.splice(i, 1)
        })
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
  .avatar{
    width: 200px;
    height: 200px;
    border-radius: 50%;
  }
</style>

